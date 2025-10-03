import { db } from '@/drizzle/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import * as schemas from '@/drizzle/schemas';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite",
    transaction: true,
    usePlural: true,
    schema: schemas,
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // resetPasswordTokenExpiresIn: 1000 * 60 * 15, // 15 minutes
  },
  user: {
    modelName: 'users',
  },
  account: {
    modelName: 'accounts',
  },
  session: {
    modelName: 'sessions',
  },
  verification: {
    modelName: 'verifications',
  },
});
