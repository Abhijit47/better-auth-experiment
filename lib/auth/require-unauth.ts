'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from './server';

// type Session = typeof auth.$Infer.Session;

export const requireUnauth = cache(async () => {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (userSession) {
    redirect('/');
  }
});
