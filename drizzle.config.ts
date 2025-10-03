import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';

loadEnvConfig(process.cwd(), true, {
  info: () => {
    console.log('Loaded env variables');
  },
  error: console.error,
});

export default defineConfig({
  schema: ['./drizzle/schemas.ts'],
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
