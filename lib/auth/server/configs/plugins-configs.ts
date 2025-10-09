import { type BetterAuthPlugin } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { haveIBeenPwned, twoFactor, username } from 'better-auth/plugins';

const pluginsConfigs = [
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
  nextCookies(),
] satisfies BetterAuthPlugin[];

export default pluginsConfigs;
