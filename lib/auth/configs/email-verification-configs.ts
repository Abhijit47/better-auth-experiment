import { sendVerificationEmail } from '@/lib/resend';
import { type BetterAuthOptions } from 'better-auth';

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

export default emailVerificationConfigs;
