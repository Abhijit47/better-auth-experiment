import { db } from '@/drizzle/db';
import { betterAuth, BetterAuthOptions, User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { haveIBeenPwned, username } from 'better-auth/plugins';

import * as schemas from '@/drizzle/schemas';
import {
  sendPasswordResetEmail,
  sendSignUpVerificationEmail,
  sendWelcomEmail,
} from '../resend';

const userConfigs: BetterAuthOptions['user'] = {
  modelName: 'users',
};

const accountConfigs: BetterAuthOptions['account'] = {
  modelName: 'accounts',
};

const sessionConfigs: BetterAuthOptions['session'] = {
  modelName: 'sessions',
  cookieCache: {
    enabled: true,
    maxAge: 60, // 1 minute
  },
};

const verificationConfigs: BetterAuthOptions['verification'] = {
  modelName: 'verifications',
};

const emailAndPasswordConfigs: BetterAuthOptions['emailAndPassword'] = {
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
};

const emailVerificationConfigs: BetterAuthOptions['emailVerification'] = {
  autoSignInAfterVerification: true,
  // send verification email on sign up
  sendOnSignUp: true,
  // if not validate email during sign up, then it will send verification email on sign in
  sendOnSignIn: true,
  expiresIn: 60 * 60 * 24, // 24 hours
  // eslint-disable-next-line
  sendVerificationEmail({ user, url, token }, request) {
    // console.log('sendVerificationEmail called with:', { user, url, token });
    return sendSignUpVerificationEmail({
      user: {
        name: user.name,
        email: user?.email,
      },
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
};

const hooksConfigs: BetterAuthOptions['hooks'] = {
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
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite",
    transaction: true,
    usePlural: false,
    schema: schemas,
    debugLogs: false,
  }),
  emailAndPassword: emailAndPasswordConfigs,
  emailVerification: emailVerificationConfigs,
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
  user: userConfigs,
  account: accountConfigs,
  session: sessionConfigs,
  verification: verificationConfigs,
  hooks: hooksConfigs,
});
