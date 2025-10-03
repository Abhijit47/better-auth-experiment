import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Route } from 'next';
import Link from 'next/link';

// const links = [
//   { href: '/sign-in', label: 'Sign In' },
//   { href: '/sign-up', label: 'Sign Up' },
// ] as const; // this also works

type NavItem<T extends string = string> = {
  href: T;
  label: string;
};

export const navItems: NavItem<Route>[] = [
  { href: '/', label: 'Home' },
  { href: '/sign-in', label: 'Sign in' },
  { href: '/sign-up', label: 'Sign up' },
  { href: '/forgot-password', label: 'Forgot Password' },
  { href: '/reset-password', label: 'Reset Password' },
];

const dynamicNavItems: NavItem<string>[] = [
  { href: '/profile', label: 'John Profile' },
  { href: '/profile/jane', label: 'Jane Profile' },
];

export default function Home() {
  return (
    <div className={'h-dvh flex items-center justify-center'}>
      {navItems.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(buttonVariants({ variant: 'link' }))}>
          {link.label}
        </Link>
      ))}

      {dynamicNavItems.map((link) => (
        <Link
          key={link.href}
          href={link.href as Route}
          className={cn(buttonVariants({ variant: 'link' }))}>
          {link.label}
        </Link>
      ))}

      <Card href={'/profile' as Route} />
    </div>
  );
}

function Card<T extends string>({ href }: { href: Route<T> | URL }) {
  return (
    <Link href={href}>
      <div>My Card</div>
    </Link>
  );
}
