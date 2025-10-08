'use client';

import { SquareArrowOutUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LazySignUpForm } from '.';
import { LazySignWithSocial } from '../../sign-in/_components';

export function SignUpCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Card className='w-full max-w-sm mx-auto gap-4 py-4'>
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            Enter your details below to create a new account
          </p>
        </CardDescription>
        <CardAction>
          <Link
            href={'/sign-in'}
            className={cn(buttonVariants({ variant: 'link' }))}>
            Sign In <SquareArrowOutUpRightIcon className='h-4 w-4' />
          </Link>
        </CardAction>
      </CardHeader>

      <Separator />
      <LazySignWithSocial isLoading={isLoading} onLoading={setIsLoading} />
      <Separator />

      <CardContent>
        <LazySignUpForm />
      </CardContent>
    </Card>
  );
}
