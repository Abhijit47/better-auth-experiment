import { type BetterAuthPlugin } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  haveIBeenPwned,
  twoFactor,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

import {
  ac,
  adminPermission,
  myCustomRolePermission,
  userPermission,
} from '../../permissions';

const pluginsConfigs = [
  admin({
    // adminRoles:["admin"],
    // defaultRole: 'regular',
    // adminUserIds: ['user_id_1', 'user_id_2'],
    // impersonationSessionDuration: 60 * 60 * 24, // 1 day
    // defaultBanReason: 'Spamming',
    // defaultBanExpiresIn: 60 * 60 * 24, // 1 day
    // bannedUserMessage: 'Custom banned user message',
    ac,
    roles: {
      admin: adminPermission,
      user: userPermission,
      myCustomRole: myCustomRolePermission,
    },
  }),
  haveIBeenPwned({
    customPasswordCompromisedMessage: 'Please choose a more secure password.',
  }),
  twoFactor({
    issuer: 'BetterAuth Demo',
    schema: {
      user: {
        modelName: 'users',
        // fields: {
        //   twoFactorEnabled: 'twoFactorEnabled',
        // },
      },
      twoFactor: {
        modelName: 'two_factors',
        // fields: {
        //   userId: 'userId',
        //   secret: 'secret',
        //   backupCodes: 'backupCodes',
        // },
      },
    },
  }),
  username({
    schema: {
      user: {
        modelName: 'users',
        fields: {
          username: 'username',
          displayUsername: 'displayUsername',
        },
      },
    },
    minUsernameLength: 5,
    maxUsernameLength: 50,
    usernameValidator: (username) => {
      if (username === 'admin') {
        return false;
      }
      return true;
    },
    displayUsernameValidator: (displayUsername) => {
      // Allow only alphanumeric characters, underscores, and hyphens
      return /^[a-zA-Z0-9_-]+$/.test(displayUsername);
    },
    usernameNormalization: (username) => {
      return username
        .toLowerCase()
        .replaceAll('0', 'o')
        .replaceAll('3', 'e')
        .replaceAll('4', 'a');
    },
    displayUsernameNormalization: (displayUsername) =>
      displayUsername.toLowerCase(),
    validationOrder: {
      username: 'post-normalization',
      displayUsername: 'post-normalization',
    },
  }),
  passkey({
    rpID: 'localhost',
    rpName: 'BetterAuth Demo',
    origin: 'http://localhost:3000',
    // authenticatorSelection: {
    //   authenticatorAttachment: 'platform', // default is unset
    //   residentKey: 'preferred', // default is "preferred"
    //   userVerification: 'preferred', // default is "preferred"
    // },
    // advanced: {
    //   webAuthnChallengeCookie:"webauthn_challenge",
    // },
    schema: {
      passkey: {
        modelName: 'passkeys',
        // fields: {},
      },
    },
  }),
  nextCookies(),
] satisfies BetterAuthPlugin[];

export default pluginsConfigs;
