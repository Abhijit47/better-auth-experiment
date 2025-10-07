import { sendVerificationEmail } from '@/lib/resend';
import { type BetterAuthOptions } from 'better-auth';

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

export default userConfigs;
