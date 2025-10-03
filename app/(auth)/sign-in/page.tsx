import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignInCard } from './_components/sign-in-card';

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect('/');
  }
  return <SignInCard />;
}
