import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { permanentRedirect } from 'next/navigation';
import { SignInCard } from './_components/sign-in-card';

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return permanentRedirect('/');
  }
  return <SignInCard />;
}
