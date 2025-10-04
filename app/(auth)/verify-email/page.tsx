import { redirect } from 'next/navigation';
import VerifyEmailCard from './_components/verify-email-card';

type PageProps = {
  params: Promise<{ email?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VerifyEmail(props: PageProps) {
  const email = (await props.params).email;
  console.log('email', email);

  if (!email) return redirect('/sign-in');

  return <VerifyEmailCard />;
}
