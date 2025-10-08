import { type BetterAuthOptions } from 'better-auth';

import {
  sendDeleteAccountVerificationEmail,
  sendVerificationEmail,
} from '@/lib/resend';

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
  deleteUser: {
    enabled: true,
    deleteTokenExpiresIn: 60 * 60, // 1 hour

    // eslint-disable-next-line
    sendDeleteAccountVerification: async (data, request) => {
      // console.log('sendDeleteAccountVerification called with:', { data });
      return await sendDeleteAccountVerificationEmail({
        user: data.user,
        url: data.url,
        token: data.token,
      });
    },

    // // eslint-disable-next-line
    // afterDelete(user, request) {
    //   console.log('User deleted:', user.id);
    //   return Promise.resolve();
    // },

    // // eslint-disable-next-line
    // beforeDelete(user, request) {
    //   console.log('Before deleting user:', user.id);
    //   return Promise.resolve();
    // },
  },
  // fields: {},
  additionalFields: {
    favoriteNumber: { type: 'number', required: true, defaultValue: 0 },
  },
} satisfies BetterAuthOptions['user'];

export default userConfigs;
