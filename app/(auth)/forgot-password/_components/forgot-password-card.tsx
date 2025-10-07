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
import { authClient } from '@/lib/auth/client/auth-client';
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormValues,
} from '@/lib/zod/schemas';
import { ArrowLeftCircle } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function ForgotPasswordCard() {
  const [isPending, startTransition] = useTransition();
  // const router = useRouter();
  // 1. Define your form.
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: 'test@test.com',
    },
    mode: 'onChange',
  });

  const currenWindowClose = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  // 2. Define a submit handler.
  function onSubmit(values: ForgotPasswordFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      await authClient.forgetPassword({
        email: values.email,
        redirectTo: `/reset-password`,
        fetchOptions: {
          onError(context) {
            // console.log('Forgot password error', context);
            toast.error(
              context.error.message ||
                'Failed to send reset email. Please try again.'
            );
            return;
          },
          // eslint-disable-next-line
          onSuccess(context) {
            // console.log('Forgot password success', context);
            // context.response.json()
            toast.success('Password reset link sent! Please check your email.');
            setTimeout(() => {
              currenWindowClose();
            }, 1200);
            return;
          },
        },
      });
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
              <Button asChild disabled={isPending}>
                <Link
                  href={'/sign-in'}
                  className={cn(
                    buttonVariants({
                      variant: 'secondary',
                      className: 'w-full',
                    })
                  )}>
                  <ArrowLeftCircle className='h-4 w-4' />
                  Go Banck to Sign-In
                </Link>
              </Button>
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
