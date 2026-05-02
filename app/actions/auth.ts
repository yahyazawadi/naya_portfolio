'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function login(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // Use getRequestContext().env for production, fallback to process.env for local
  const env = getRequestContext().env;
  const ADMIN_USERNAME = env.ADMIN_USERNAME || process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return { error: 'Server configuration error. Admin credentials not set.' };
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    // Set a simple session cookie
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    redirect('/admin');
  } else {
    return { error: 'Invalid username or password' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}
