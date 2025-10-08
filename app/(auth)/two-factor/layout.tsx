import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: {
    absolute: 'Two Factor Authentication',
  },
  description: 'Secure your Better Auth account with two-factor authentication',
};

export default function TwoFactorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='w-full h-full grid lg:grid-cols-2 items-center p-4'>
        <div className='bg-muted hidden h-full w-full lg:block rounded-lg border p-4'>
          <div className={'aspect-square w-full h-full'}>
            <Image
              src={'/two-factor-authentication.svg'}
              alt='Tow Factor Authentication'
              width={500}
              height={500}
              className={'w-full h-full object-contain'}
              priority
            />
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
