'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Separator } from '../ui/separator';

export default function UserButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const session = authClient.useSession();

  return (
    <>
      {session.isPending ? (
        <Button variant={'ghost'} size={'icon'}>
          <Loader className='animate-spin size-4' />
        </Button>
      ) : (
        <>
          {!session.data ? (
            <>
              <Link
                href={'/sign-in'}
                className={cn(buttonVariants({ variant: 'link' }))}>
                Sign in
              </Link>
            </>
          ) : (
            <>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={
                      'rounded-full p-0.5 hover:ring-1 data-state-open:ring-1 hover:ring-primary hover:ring-offset-1 hover:ring-offset-background transition-all'
                    }>
                    <Image
                      src={
                        session.data.user.image ??
                        `https://avatar.vercel.sh/rauchg.svg?text=${
                          session.data.user.name?.[0] ?? 'U'
                        }`
                      }
                      alt={session.data.user.name}
                      width={40}
                      height={40}
                      className={'object-cover w-full h-full rounded-full'}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='min-w-xs w-full p-4' align='end'>
                  <div className='grid gap-4'>
                    <div className='space-y-2'>
                      <h4 className='leading-none font-medium'>
                        {session.data.user.name}
                      </h4>
                      <p className='text-muted-foreground text-sm'>
                        {session.data.user.email}
                      </p>
                    </div>
                    <Separator />
                    <div className='grid gap-2'>
                      <Link
                        href={'#'}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'font-medium hover:underline',
                          'px-2 py-1 rounded-md',
                          'hover:bg-accent hover:text-accent-foreground',
                          'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
                        )}>
                        Admin
                      </Link>
                      <Link
                        href={'#'}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'font-medium hover:underline',
                          'px-2 py-1 rounded-md',
                          'hover:bg-accent hover:text-accent-foreground',
                          'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
                        )}>
                        Profile
                      </Link>
                    </div>

                    <Separator />

                    <Button
                      disabled={isPending}
                      variant={'destructive'}
                      size={'sm'}
                      onClick={() => {
                        startTransition(async () => {
                          await authClient.signOut({
                            fetchOptions: {
                              onSuccess() {
                                setIsOpen(false);
                                router.push('/sign-in');
                              },
                            },
                          });
                        });
                      }}>
                      {isPending ? 'Signing out...' : 'Sign out'}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </>
      )}
    </>
  );
}
