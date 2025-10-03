import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={'h-dvh flex items-center justify-center'}>
      <Link
        href={'/sign-in'}
        className={cn(buttonVariants({ variant: 'link' }))}>
        Sign-in
      </Link>
      <Link
        href={'/sign-up'}
        className={cn(buttonVariants({ variant: 'link' }))}>
        Sign-in
      </Link>
    </div>
  );
}
