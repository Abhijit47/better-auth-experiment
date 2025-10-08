import { redirect } from 'next/navigation';

import { LazyVerifyEmailCard } from './_components';

type PageProps = {
  params: Promise<{ email?: string }>;
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function VerifyEmail(props: PageProps) {
  const email = (await props.searchParams).email;

  if (!email) return redirect('/sign-in');

  return <LazyVerifyEmailCard email={email} />;
}
