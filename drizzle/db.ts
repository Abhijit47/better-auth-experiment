import * as schemas from '@/drizzle/schemas';

import { Pool } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/neon-serverless';

loadEnvConfig(process.cwd(), true, {
  info: () => {
    console.log('Loaded env variables');
  },
  error: console.error,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema: schemas,
});
