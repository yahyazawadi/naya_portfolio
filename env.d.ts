import { D1Database, R2Bucket } from '@cloudflare/workers-types';

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    BUCKET: R2Bucket;
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD?: string;
    R2_ENDPOINT?: string;
    R2_BUCKET_NAME?: string;
    NEXT_PUBLIC_R2_PUBLIC_URL?: string;
  }
}
