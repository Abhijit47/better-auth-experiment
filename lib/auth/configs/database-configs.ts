import { db } from '@/drizzle/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import type { Adapter, BetterAuthOptions } from 'better-auth';

import * as schemas from '@/drizzle/schemas';

const databaseConfigs = drizzleAdapter(db, {
  provider: 'pg', // or "mysql", "sqlite",
  transaction: true,
  schema: schemas,
  debugLogs: false,
  // usePlural: false,
  // camelCase: true,
}) satisfies (options: BetterAuthOptions) => Adapter;

export default databaseConfigs;
