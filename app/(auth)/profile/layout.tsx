import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Profile',
  },
  description: 'User profile layout for Better Auth',
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='w-full h-full grid items-center p-4'>{children}</div>
    </section>
  );
}
