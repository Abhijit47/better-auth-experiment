'use client';

import Link from 'next/link';

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
import { LazyForgotPasswordForm } from '.';

export function ForgotPasswordCard() {
  return (
    <Card className='w-full max-w-sm mx-auto gap-4 py-4'>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>Enter your email to reset your password.</p>
        </CardDescription>
        <CardAction>
          <Link
            href={'/sign-up'}
            className={cn(buttonVariants({ variant: 'link' }))}>
            Sign Up
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <LazyForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
