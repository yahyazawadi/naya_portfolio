import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const fileExtension = file.name.split('.').pop() || 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    // Env vars can be in process.env (Local) or context.env (Production)
    const context = getRequestContext();
    const env = context?.env || process.env;
    const r2PublicUrl = env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-49f6712bf69144dbb92c254052a438e3.r2.dev';

    console.log(`[Upload] Processing: ${fileName} (${file.type}, ${bytes.byteLength} bytes)`);

    const isDev = process.env.NODE_ENV === 'development';

    // 1. Try Cloudflare R2 Binding (Production/Preview)
    // In local dev, we skip this to use S3 fallback so files go to the real R2 for public URL access
    if (!isDev) {
      try {
        const bucket = env.BUCKET as any;
        if (bucket && typeof bucket.put === 'function') {
          console.log(`[Upload] Using R2 Binding for ${fileName}`);
          await bucket.put(fileName, bytes, {
            httpMetadata: { contentType: file.type }
          });
          const publicUrl = `${r2PublicUrl}/${fileName}`;
          return NextResponse.json({ success: true, url: publicUrl });
        }
      } catch (e: any) {
        console.warn("[Upload] R2 Binding failed, trying S3 fallback:", e.message);
      }
    } else {
      console.log(`[Upload] Local dev detected, skipping R2 Binding for S3 fallback to real R2.`);
    }

    // 2. Fallback to S3 Client (Local Dev)
    const s3Config = {
      region: "auto",
      endpoint: env.R2_ENDPOINT || process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '',
      },
    };

    if (!s3Config.endpoint || !s3Config.credentials.accessKeyId) {
      throw new Error("R2 configuration missing (no Binding and no S3 credentials)");
    }

    const s3 = new S3Client(s3Config);
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: new Uint8Array(bytes),
      ContentType: file.type,
    });

    await s3.send(command);
    const publicUrl = `${r2PublicUrl}/${fileName}`;
    console.log(`[Upload] S3 Fallback success: ${publicUrl}`);
    
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("[Upload] Critical Error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
