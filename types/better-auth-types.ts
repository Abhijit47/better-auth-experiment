import { BetterAuthClientPlugin, BetterAuthOptions } from 'better-auth';
import { BetterFetchOption } from 'better-auth/react';

import { auth } from '@/lib/auth/auth';
import { authClient } from '@/lib/auth/auth-client';

export type Account = Awaited<
  ReturnType<typeof auth.api.listUserAccounts>
>[number];

export type UserWithAddlInfo = (typeof authClient.$Infer.Session)['user'];

export type ClientConfigs = {
  fetchOptions?: BetterFetchOption;
  plugins?: BetterAuthClientPlugin[];
  baseURL?: string;
  basePath?: string;
  disableDefaultFetchPlugins?: boolean;
  $InferAuth?: BetterAuthOptions;
};
