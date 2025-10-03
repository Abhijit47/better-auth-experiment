import { db } from '@/drizzle/db';
import { betterAuth, BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { haveIBeenPwned, username } from 'better-auth/plugins';

import * as schemas from '@/drizzle/schemas';

const userObj: BetterAuthOptions['user'] = {
  modelName: 'users',
};
const accountObj: BetterAuthOptions['account'] = {
  modelName: 'accounts',
};
const sessionObj: BetterAuthOptions['session'] = {
  modelName: 'sessions',
  cookieCache: {
    enabled: true,
    maxAge: 60, // 1 minute
  },
};
const verificationObj: BetterAuthOptions['verification'] = {
  modelName: 'verifications',
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite",
    transaction: true,
    usePlural: false,
    schema: schemas,
    debugLogs: false,
  }),
  emailAndPassword: {
    autoSignIn: false, //defaults to true,
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    haveIBeenPwned({
      customPasswordCompromisedMessage: 'Please choose a more secure password.',
    }),
    username({
      minUsernameLength: 5,
      maxUsernameLength: 50,
      usernameValidator: (username) => {
        if (username === 'admin') {
          return false;
        }
        return true;
      },
      displayUsernameValidator: (displayUsername) => {
        // Allow only alphanumeric characters, underscores, and hyphens
        return /^[a-zA-Z0-9_-]+$/.test(displayUsername);
      },
      usernameNormalization: (username) => {
        return username
          .toLowerCase()
          .replaceAll('0', 'o')
          .replaceAll('3', 'e')
          .replaceAll('4', 'a');
      },
      displayUsernameNormalization: (displayUsername) =>
        displayUsername.toLowerCase(),
      validationOrder: {
        username: 'post-normalization',
        displayUsername: 'post-normalization',
      },
    }),
    nextCookies(),
  ],
  user: userObj,
  account: accountObj,
  session: sessionObj,
  verification: verificationObj,
});
