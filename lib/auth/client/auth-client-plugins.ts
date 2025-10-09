import { type BetterAuthClientPlugin } from 'better-auth';
import {
  inferAdditionalFields,
  passkeyClient,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';

import { auth } from '../server';

const clientPlugins = [
  inferAdditionalFields<typeof auth>(),
  usernameClient(),
  twoFactorClient({
    onTwoFactorRedirect: () => {
      window.location.href = '/two-factor';
    },
  }),
  passkeyClient(),
] satisfies BetterAuthClientPlugin[];

export default clientPlugins;
