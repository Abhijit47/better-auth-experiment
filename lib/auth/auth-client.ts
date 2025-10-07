import { createAuthClient } from 'better-auth/react';

import authClientConfigs from './auth-client-configs';

export const authClient = createAuthClient(authClientConfigs);
