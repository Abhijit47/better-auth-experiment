import {
  inferAdditionalFields,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { BetterAuthClientPlugin } from 'better-auth/types';

import { ClientConfigs } from '@/types/better-auth-types';
import { auth } from './auth';

const clientPlugins = [
  inferAdditionalFields<typeof auth>(),
  usernameClient(),
  twoFactorClient({
    onTwoFactorRedirect: () => {
      window.location.href = '/two-factor';
    },
  }),
] satisfies BetterAuthClientPlugin[];

const authClientConfigs = {
  // baseURL: 'http://localhost:3000',
  // basePath: '/auth',
  plugins: clientPlugins,
  // disableDefaultFetchPlugins: false,
  // fetchOptions: {},
  // $InferAuth: {}
} satisfies ClientConfigs;

export const authClient = createAuthClient(authClientConfigs);
