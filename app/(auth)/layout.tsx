import type { Metadata } from 'next';

export const metadata: Metadata = {
  applicationName: 'Better Auth Demo',
  title: {
    default: 'Authentication - Better Auth',
    template: '%s | Better Auth',
  },
  description: 'Authentication layout for Better Auth',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Authentication',
    'Better Auth',
    'PostgreSQL',
    'Neon',
    'Tailwind CSS',
    'shadcn/ui',
    'Radix UI',
  ],
  creator: 'Abhijit Karmakar',
  authors: [{ name: 'Abhijit Karmakar', url: 'https://abhijitkarmakar.com' }],
  // colorScheme: 'dark',
  // viewport: {},
  publisher: 'Abhijit Karmakar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className={'px-4 2xl:px-0 w-full h-full'}>{children}</main>;
}
