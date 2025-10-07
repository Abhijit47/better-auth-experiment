import { sendPasswordResetEmail } from '@/lib/resend';
import { type BetterAuthOptions } from 'better-auth';

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

export default emailAndPasswordConfigs;
