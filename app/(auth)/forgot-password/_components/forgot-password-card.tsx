'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormValues,
} from '@/lib/zod/schemas';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function ForgotPasswordCard() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  // 2. Define a submit handler.
  function onSubmit(values: ForgotPasswordFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      console.log(values);
      // simulate async action
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/reset-password');
      return;
    });
  }

  return (
    <Card className='w-full max-w-sm'>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='someone@example.com'
                      {...field}
                    />
                  </FormControl>

                  <FormDescription className={'text-xs'}>
                    We&apos;ll never share your email.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            <CardAction className={'w-full space-y-2'}>
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </CardAction>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
