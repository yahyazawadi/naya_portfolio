import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { env } = getRequestContext();
    const db = env.DB;
    const bucket = (env.BUCKET || (env as any).R2_BUCKET);

    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket binding not found' }, { status: 500 });
    }

    // 1. Get all assets currently in the Database
    const groups = await db.prepare('SELECT cover_image, images FROM portfolio_groups').all();
    const activeUrls = new Set<string>();
    
    groups.results.forEach((row: any) => {
      if (row.cover_image) activeUrls.add(row.cover_image);
      if (row.images) {
        try {
          const imgs = JSON.parse(row.images);
          imgs.forEach((url: string) => activeUrls.add(url));
        } catch (e) {}
      }
    });

    // 2. List all objects in R2
    const listed = await bucket.list();
    const orphans: string[] = [];
    const candidatesForDeletion: string[] = [];

    for (const obj of listed.objects) {
      const key = obj.key;
      const isUnoptimized = /\.(jpg|jpeg|png|mp4|mov)$/i.test(key);
      
      // Check if this specific key is in any active URL
      const isActive = Array.from(activeUrls).some(url => url.includes(key));
      
      if (!isActive && isUnoptimized) {
        // Additional check: Does a webp/webm version exist?
        const base = key.substring(0, key.lastIndexOf('.'));
        const hasOptimized = listed.objects.some(o => 
          (o.key === `${base}.webp` || o.key === `${base}.webm`) && activeUrls.has(o.key)
        );
        
        // Even if it doesn't have an optimized version, if it's not in the DB, it's an orphan
        // but we'll prioritize unoptimized orphans for this report
        candidatesForDeletion.push(key);
      }
    }

    return NextResponse.json({ 
      count: candidatesForDeletion.length,
      orphans: candidatesForDeletion,
      message: "Scan complete. These files are not in the database and appear to be legacy assets."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { env } = getRequestContext();
    const bucket = (env.BUCKET || (env as any).R2_BUCKET);
    const { keys } = await req.json() as { keys: string[] };

    if (!bucket || !keys || !Array.isArray(keys)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    console.log(`[Cleanup] Deleting ${keys.length} assets...`);
    
    // Batch delete
    await Promise.all(keys.map(key => bucket.delete(key)));

    return NextResponse.json({ success: true, deletedCount: keys.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
