import Image from 'next/image';

export default function VerifyEmailLayout({
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
              src={'/email-consent.svg'}
              alt='email consent'
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
