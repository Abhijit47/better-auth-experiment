import { type BetterAuthClientPlugin } from 'better-auth';
import {
  adminClient,
  inferAdditionalFields,
  passkeyClient,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';

import { auth } from '../server';

import {
  ac,
  adminPermission,
  myCustomRolePermission,
  userPermission,
} from '../permissions';

const clientPlugins = [
  adminClient({
    ac,
    roles: {
      admin: adminPermission,
      user: userPermission,
      myCustomRole: myCustomRolePermission,
    },
  }),
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
