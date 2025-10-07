import {
  inferAdditionalFields,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from './auth';

export const authClient = createAuthClient({
  // baseURL: 'http://localhost:3000', // The base URL of your auth server
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = '/two-factor';
      },
    }),
  ],
});
