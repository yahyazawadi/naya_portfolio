import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { oldUrl?: string; newUrl?: string };
    const { oldUrl, newUrl } = body;

    if (!oldUrl || !newUrl) {
      return NextResponse.json({ error: "Missing oldUrl or newUrl" }, { status: 400 });
    }

    // 1. Verify Admin Session
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const context = getRequestContext();
    const db = context?.env?.DB || (process.env as any).DB;
    const env = context?.env || (process.env as any);

    if (!db) {
      throw new Error("D1 Database binding 'DB' not found");
    }

    console.log(`[Image Replace] Replacing ${oldUrl} with ${newUrl}`);

    // 2. Update Database (Search and Replace in JSON and columns)
    // Using INSTR instead of LIKE to avoid "pattern too complex" errors with long URLs
    await db.prepare(`
      UPDATE portfolio_groups 
      SET 
        cover_image = REPLACE(cover_image, ?, ?),
        images = REPLACE(images, ?, ?)
      WHERE 
        INSTR(cover_image, ?) > 0 OR INSTR(images, ?) > 0
    `)
    .bind(oldUrl, newUrl, oldUrl, newUrl, oldUrl, oldUrl)
    .run();

    // 3. Delete old asset from R2
    try {
      // Extract key from oldUrl
      const urlParts = oldUrl.split('/');
      const key = urlParts[urlParts.length - 1];

      const isDev = process.env.NODE_ENV === 'development';
      
      if (!isDev) {
        const bucket = env.BUCKET as any;
        if (bucket && typeof bucket.delete === 'function') {
          console.log(`[Image Replace] Deleting from R2 Binding: ${key}`);
          await bucket.delete(key);
        }
      }

      // S3 Fallback Delete
      const s3Config = {
        region: "auto",
        endpoint: (env.R2_ENDPOINT || process.env.R2_ENDPOINT) as string,
        credentials: {
          accessKeyId: (env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '') as string,
          secretAccessKey: (env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '') as string,
        },
      };

      const s3 = new S3Client(s3Config);
      const deleteCommand = new DeleteObjectCommand({
        Bucket: (env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME) as string,
        Key: key,
      });

      await s3.send(deleteCommand);
      console.log(`[Image Replace] Deleted old asset: ${key}`);
    } catch (deleteErr: any) {
      console.warn("[Image Replace] Asset deletion failed (might be expected if file doesn't exist):", deleteErr.message);
      // We don't fail the whole request if deletion fails, as the DB is already updated
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Image Replace] Critical Error:", err);
    return NextResponse.json({ error: err.message || "Replacement failed" }, { status: 500 });
  }
}
