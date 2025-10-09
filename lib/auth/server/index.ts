import { betterAuth } from 'better-auth';

import {
  accountConfigs,
  apiErrorConfigs,
  databaseConfigs,
  emailAndPasswordConfigs,
  emailVerificationConfigs,
  hooksConfigs,
  loggerConfigs,
  pluginsConfigs,
  sessionConfigs,
  socialProvidersConfigs,
  telemetryConfigs,
  userConfigs,
  verificationConfigs,
} from './configs';

export const auth = betterAuth({
  appName: 'BetterAuth Demo',
  database: databaseConfigs,
  emailAndPassword: emailAndPasswordConfigs,
  emailVerification: emailVerificationConfigs,
  socialProviders: socialProvidersConfigs,
  plugins: pluginsConfigs,
  user: userConfigs,
  account: accountConfigs,
  session: sessionConfigs,
  verification: verificationConfigs,
  hooks: hooksConfigs,
  logger: loggerConfigs,
  onAPIError: apiErrorConfigs,
  telemetry: telemetryConfigs,
});
