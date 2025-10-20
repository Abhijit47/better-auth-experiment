'use server';

import { redirect } from 'next/navigation';
import { cache } from 'react';

import { adminPermission } from './permissions';
import { requireAuth } from './require-auth';
import { auth } from './server';

// type Session = typeof auth.$Infer.Session;

export const requirePermission = cache(async () => {
  const { user } = await requireAuth();

  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      role: 'admin',
      // permission: {
      //   project: ['create', 'update', 'delete'],
      // },
      permissions: adminPermission.statements,
    },
  });
  if (!hasPermission.success) {
    redirect('/sign-in');
  }

  return hasPermission.success;
});
