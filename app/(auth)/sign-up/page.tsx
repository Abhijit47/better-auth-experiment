import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignUpCard } from './_components/sign-up-card';

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect('/');
  }
  return <SignUpCard />;
}
