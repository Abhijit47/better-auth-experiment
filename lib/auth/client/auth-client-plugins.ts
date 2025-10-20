import { type BetterAuthClientPlugin } from 'better-auth';
import {
  adminClient,
  inferAdditionalFields,
  passkeyClient,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';

import { auth } from '../server';

const clientPlugins = [
  adminClient(),
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
