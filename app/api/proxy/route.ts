import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Target returned ${response.status}`);

    // Stream the body instead of loading it into a blob
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Access-Control-Allow-Origin', '*'); 
    
    // Pass through Content-Length if available for better progress reporting
    const length = response.headers.get('Content-Length');
    if (length) headers.set('Content-Length', length);

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new NextResponse(`Proxy failed: ${error.message}`, { status: 500 });
  }
}
