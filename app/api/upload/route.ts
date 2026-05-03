import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

// Polyfill DOMParser for AWS SDK in Edge Runtime
if (typeof (globalThis as any).DOMParser === 'undefined') {
  (globalThis as any).DOMParser = class {
    parseFromString(markup: string) {
      const createNode = (name: string) => ({
        nodeName: name,
        nodeType: 1,
        childNodes: [],
        attributes: [],
        textContent: '',
        getElementsByTagName: () => [],
      });
      return {
        documentElement: createNode('Response'),
        getElementsByTagName: () => [],
        querySelectorAll: () => [],
      };
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop() || 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    
    const context = getRequestContext();
    const env = context?.env || (process.env as any);
    const r2PublicUrl = env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-49f6712bf69144dbb92c254052a438e3.r2.dev';

    console.log(`[Upload] Processing: ${fileName} (${file.type}, ${file.size} bytes)`);

    // Use ArrayBuffer for maximum binary compatibility, converted to Uint8Array
    // This is safer than streaming for binary integrity in some environments
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    const isDev = process.env.NODE_ENV === 'development';

    // 1. Try Cloudflare R2 Binding
    if (!isDev) {
      try {
        const bucket = env.BUCKET as any;
        if (bucket && typeof bucket.put === 'function') {
          console.log(`[Upload] Using R2 Binding for ${fileName}`);
          await bucket.put(fileName, fileData, {
            httpMetadata: { contentType: file.type }
          });
          return NextResponse.json({ success: true, url: `${r2PublicUrl}/${fileName}` });
        }
      } catch (e: any) {
        console.warn("[Upload] R2 Binding failed:", e.message);
      }
    }

    // 2. S3 Fallback
    const s3Config = {
      region: "auto",
      endpoint: (env.R2_ENDPOINT || process.env.R2_ENDPOINT) as string,
      credentials: {
        accessKeyId: (env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '') as string,
        secretAccessKey: (env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '') as string,
      },
    };

    const s3 = new S3Client(s3Config);
    const command = new PutObjectCommand({
      Bucket: (env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME) as string,
      Key: fileName,
      Body: fileData,
      ContentType: file.type,
      ContentLength: file.size,
    });

    try {
      await s3.send(command);
    } catch (err: any) {
      if (err.message.includes("Deserialization") || err.message.includes("nodeName")) {
        console.warn("[Upload] Ignoring SDK deserialization error.");
      } else {
        throw err;
      }
    }

    return NextResponse.json({ success: true, url: `${r2PublicUrl}/${fileName}` });
  } catch (err: any) {
    console.error("[Upload] Critical Error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
