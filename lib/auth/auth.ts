import { db } from '@/drizzle/db';
import {
  betterAuth,
  type Adapter,
  type BetterAuthOptions,
  type BetterAuthPlugin,
  type Logger,
  type User,
} from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { haveIBeenPwned, twoFactor, username } from 'better-auth/plugins';

import * as schemas from '@/drizzle/schemas';

import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomEmail,
} from '../resend';

const userConfigs = {
  modelName: 'users',
  changeEmail: {
    enabled: true,
    // eslint-disable-next-line
    sendChangeEmailVerification: async (data, request) => {
      // console.log('sendChangeEmailVerification called with:', { data });
      return await sendVerificationEmail({
        user: { ...data.user, email: data.newEmail },
        url: data.url,
        token: data.token,
      });
    },
  },
  // deleteUser: {},
  // fields: {},
  additionalFields: {
    favoriteNumber: { type: 'number', required: true, defaultValue: 0 },
  },
} satisfies BetterAuthOptions['user'];

const accountConfigs = {
  modelName: 'accounts',
} satisfies BetterAuthOptions['account'];

const sessionConfigs = {
  modelName: 'sessions',
  // fields: {},
  // cookieCache: {
  //   enabled: true,
  //   maxAge: 60 * 60 * 24, // 24 hours
  // },
  // freshAge: 60 * 15, // 15 minutes
  // updateAge: 60 * 60, // 1 hour
  // expiresIn: 60 * 60 * 24 * 7, // 7 days
  // preserveSessionInDatabase: true,
  // storeSessionInDatabase: true,
  // disableSessionRefresh: false,
  // additionalFields: {},
} satisfies BetterAuthOptions['session'];

const verificationConfigs = {
  modelName: 'verifications',
} satisfies BetterAuthOptions['verification'];

const emailAndPasswordConfigs = {
  // Automatically sign in the user after sign up
  autoSignIn: false, //defaults to true,
  enabled: true,

  requireEmailVerification: true,
  // eslint-disable-next-line
  sendResetPassword: async ({ user, url, token }, request) => {
    // console.log('sendResetPassword called with:', { user, url, token });
    return await sendPasswordResetEmail({
      user: user,
      url,
      token,
    });
  },
  resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  revokeSessionsOnPasswordReset: true,
  // eslint-disable-next-line
  onPasswordReset(data, request) {
    console.log('onPasswordReset', { data });
    return Promise.resolve();
  },
  // disableSignUp: false,
  // minPasswordLength: 8,
  // maxPasswordLength: 128,

  // **Custom password hashing and verification**
  // password: {
  //   hash(password) {
  //     console.log('hashing password', { password });
  //     return Promise.resolve(password); // TODO: implement hash
  //   },
  //   verify(data) {
  //     console.log('verifying password', { data });
  //     return Promise.resolve(true); // TODO: implement verify
  //   },
  // },
} satisfies BetterAuthOptions['emailAndPassword'];

const emailVerificationConfigs = {
  autoSignInAfterVerification: true,
  // send verification email on sign up
  sendOnSignUp: true,
  // if not validate email during sign up, then it will send verification email on sign in
  sendOnSignIn: true,
  expiresIn: 60 * 60 * 24, // 24 hours
  // eslint-disable-next-line
  sendVerificationEmail: async ({ user, url, token }, request) => {
    // console.log('sendVerificationEmail called with:', { user, url, token });
    return await sendVerificationEmail({
      user: user,
      url,
      token,
    });
  },

  // Extra Hooks
  // onEmailVerification(user, request) {
  //   // console.log({ request });
  //   console.log('onEmailVerification:', user);
  //   return Promise.resolve();
  // },
  // // eslint-disable-next-line
  // afterEmailVerification(user, request) {
  //   // console.log({ request });
  //   console.log('afterEmailVerification:', user);
  //   return Promise.resolve();
  // },
} satisfies BetterAuthOptions['emailVerification'];

const socialProvidersConfigs = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    mapProfileToUser(profile) {
      return {
        favoriteNumber: Number(profile.public_repos) || 0,
      };
    },
    // redirectURI: "/profile",
  },
} satisfies BetterAuthOptions['socialProviders'];

const pluginsConfigs = [
  haveIBeenPwned({
    customPasswordCompromisedMessage: 'Please choose a more secure password.',
  }),
  twoFactor({
    schema: {
      user: {
        modelName: 'users',
        fields: {
          twoFactorEnabled: 'twoFactorEnabled',
        },
      },
      twoFactor: {
        modelName: 'two_factors',
        fields: {
          userId: 'userId',
          secret: 'secret',
          backupCodes: 'backupCodes',
        },
      },
    },
  }),
  username({
    schema: {
      user: {
        modelName: 'users',
        fields: {
          username: 'username',
          displayUsername: 'displayUsername',
        },
      },
    },
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
] satisfies BetterAuthPlugin[];

const hooksConfigs = {
  after: createAuthMiddleware(async (ctx) => {
    if (ctx.path.startsWith('/sign-up')) {
      const body = ctx.body as User;
      const url = 'https://avatar.vercel.sh/rauchg?rounded=60';
      const user = ctx.context.newSession?.user ?? {
        name: body.name,
        email: body.email,
        image: body.image,
      };

      if (user !== null) {
        await sendWelcomEmail({
          name: user.name,
          userImage: user.image ?? url,
          email: user.email,
        });
      }
    }
  }),
} satisfies BetterAuthOptions['hooks'];

const loggerConfigs = {
  disableColors: false,
  disabled: false,
  level: 'info',
  // log: (level, message, ...meta) => {
  //   const logMessage = `[${level.toUpperCase()}] ${message} ${
  //     meta ? JSON.stringify(meta) : ''
  //     }`;
  //   if (level === 'error') {
  //     console.error(logMessage);
  //   }
  //   else if (level === 'warn') {
  //     console.warn(logMessage);
  //   }
  //   else {
  //     console.log(logMessage);
  //   }
  // },
  log(level, message, ...args) {
    const logMessage = `[${level.toUpperCase()}] ${message} ${
      args ? JSON.stringify(args) : ''
    }`;
    if (level === 'error') {
      console.error(logMessage);
    } else if (level === 'warn') {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  },
} satisfies Logger;

const databaseConfigs = drizzleAdapter(db, {
  provider: 'pg', // or "mysql", "sqlite",
  transaction: true,
  schema: schemas,
  debugLogs: false,
  // usePlural: false,
  // camelCase: true,
}) satisfies (options: BetterAuthOptions) => Adapter;

export const auth = betterAuth({
  appName: 'BetterAuth Demo',
  database: databaseConfigs,
  emailAndPassword: emailAndPasswordConfigs,
  emailVerification: emailVerificationConfigs,
  socialProviders: socialProvidersConfigs,
  plugins: pluginsConfigs,
  user: userConfigs,
  account: accountConfigs,
  session: sessionConfigs,
  verification: verificationConfigs,
  hooks: hooksConfigs,
  logger: loggerConfigs,
  onAPIError: {
    throw: true,
    onError(error, ctx) {
      console.error('API Error:', { error, ctx });
      return Promise.reject(error);
    },
    errorURL: '/api/auth/my-error',
  },
});
