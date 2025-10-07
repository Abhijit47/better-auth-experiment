'use server';

import { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from './server/auth';

export const getUserAccounts = cache(async (pathName?: Route) => {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  if (accounts.length === 0) {
    return redirect(pathName ? pathName : '/sign-in');
  }

  return accounts;
});
