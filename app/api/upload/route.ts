import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a clean filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    // Determine Public URL base
    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-49f6712bf69144dbb92c254052a438e3.r2.dev';

    // Try to use Cloudflare R2 Binding first (Production)
    try {
      const bucket = getRequestContext()?.env?.BUCKET;
      if (bucket) {
        await bucket.put(fileName, buffer, {
          httpMetadata: { contentType: file.type }
        });
        const publicUrl = `${r2PublicUrl}/${fileName}`;
        return NextResponse.json({ success: true, url: publicUrl });
      }
    } catch (e) {
      console.log("R2 Binding not found or failed, falling back to S3 Client");
    }

    // Fallback to S3 Client (Local Dev or if Binding fails)
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);
    const publicUrl = `${r2PublicUrl}/${fileName}`;
    
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("API Upload Error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
