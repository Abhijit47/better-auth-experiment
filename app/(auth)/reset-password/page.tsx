import { redirect } from 'next/navigation';
import { ResetPasswordCard } from './_components/reset-password-card';

type PageProps = {
  params: Promise<{ email?: string }>;
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function ResetPassword(props: PageProps) {
  const token = (await props.searchParams).token;

  if (!token) return redirect('/sign-in');

  return <ResetPasswordCard token={token} />;
}
