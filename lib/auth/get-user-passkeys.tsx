'use server';

import { auth } from '@/lib/auth/server';
import { headers } from 'next/headers';
import { cache } from 'react';

export const getUserPasskeys = cache(async () => {
  const passkeys = await auth.api.listPasskeys({ headers: await headers() });

  return passkeys;
});
