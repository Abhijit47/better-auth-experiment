'use server';

// import { unstable_cache as cache } from 'next/cache';
import { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from './server/auth';

// type Session = typeof auth.$Infer.Session;

export const requireAuth = cache(async (pathname?: Route) => {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession) {
    redirect(pathname ? pathname : '/sign-in');
  }

  const user = userSession.user;
  const session = userSession.session;

  return { user, session };
});
