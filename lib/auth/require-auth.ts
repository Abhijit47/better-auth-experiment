'use server';

// import { unstable_cache as cache } from 'next/cache';
import { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';
type Session = typeof auth.$Infer.Session;

export async function requireAuth(pathname: Route) {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect(pathname);
  }
  return session;
}
