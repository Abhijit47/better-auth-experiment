import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: {
    absolute: 'Reset Password',
  },
  description: 'Set a new password for your Better Auth account',
};

export default function ResetPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='w-full h-full grid lg:grid-cols-2 items-center p-4'>
        <div className='bg-muted hidden h-full w-full lg:block rounded-lg border p-4'>
          <Image
            src={'/forgot-password.svg'}
            alt='forgot password'
            width={500}
            height={500}
            className={'w-full h-full object-contain'}
            priority
          />
        </div>
        {children}
      </div>
    </section>
  );
}
