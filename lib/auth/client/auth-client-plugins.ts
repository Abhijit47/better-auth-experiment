import { type BetterAuthClientPlugin } from 'better-auth';
import {
  inferAdditionalFields,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';

import { auth } from '../server/auth';

const clientPlugins = [
  inferAdditionalFields<typeof auth>(),
  usernameClient(),
  twoFactorClient({
    onTwoFactorRedirect: () => {
      window.location.href = '/two-factor';
    },
  }),
] satisfies BetterAuthClientPlugin[];

export default clientPlugins;
