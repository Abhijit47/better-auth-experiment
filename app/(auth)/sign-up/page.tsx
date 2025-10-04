import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { permanentRedirect } from 'next/navigation';
import { SignUpCard } from './_components/sign-up-card';

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    return permanentRedirect('/');
  }
  return <SignUpCard />;
}
