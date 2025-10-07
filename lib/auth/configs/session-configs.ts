import { type BetterAuthOptions } from 'better-auth';

const sessionConfigs = {
  modelName: 'sessions',
  // fields: {},
  // cookieCache: {
  //   enabled: true,
  //   maxAge: 60 * 60 * 24, // 24 hours
  // },
  // freshAge: 60 * 15, // 15 minutes
  // updateAge: 60 * 60, // 1 hour
  // expiresIn: 60 * 60 * 24 * 7, // 7 days
  // preserveSessionInDatabase: true,
  // storeSessionInDatabase: true,
  // disableSessionRefresh: false,
  // additionalFields: {},
} satisfies BetterAuthOptions['session'];

export default sessionConfigs;
