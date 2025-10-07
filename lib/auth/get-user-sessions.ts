'use server';

import { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from './auth';

export const getUserSessions = cache(async (pathName?: Route) => {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  if (sessions.length === 0) {
    return redirect(pathName ? pathName : '/sign-in');
  }

  return sessions;
});
