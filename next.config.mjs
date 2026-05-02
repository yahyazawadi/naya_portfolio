import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Initialize the Cloudflare developer platform for local development
if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
};

export default nextConfig;