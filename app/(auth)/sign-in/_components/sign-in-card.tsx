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
import { cn } from '@/lib/utils';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LazySignWithEmailForm,
  LazySignWithSocial,
  LazySignWithUsernameForm,
} from '.';

type Tabs = 'email' | 'username';

export function SignInCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<Tabs>('email');

  return (
    <Card className='w-full max-w-sm mx-auto gap-4 py-4'>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            Enter your email below to login to your account
          </p>
        </CardDescription>
        <CardAction>
          <Link
            href={'/sign-up'}
            className={cn(buttonVariants({ variant: 'link' }))}>
            Sign Up <SquareArrowOutUpRightIcon className='h-4 w-4' />
          </Link>
        </CardAction>
      </CardHeader>

      <Separator />

      <LazySignWithSocial isLoading={isLoading} onLoading={setIsLoading} />

      <Separator />

      <CardContent>
        <Tabs
          className='w-full'
          defaultValue={tab}
          onValueChange={(tab) => setTab(tab as Tabs)}>
          <TabsList className={'w-full'}>
            <TabsTrigger value='email' disabled={isLoading}>
              Email
            </TabsTrigger>
            <TabsTrigger value='username' disabled={isLoading}>
              Username
            </TabsTrigger>
          </TabsList>

          <Separator className={'mt-2'} />

          {tab === 'email' ? (
            <LazySignWithEmailForm
              isLoading={isLoading}
              onLoading={setIsLoading}
            />
          ) : (
            <LazySignWithUsernameForm
              isLoading={isLoading}
              onLoading={setIsLoading}
            />
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
