'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/client/auth-client';
import {
  resetPasswordFormSchema,
  ResetPasswordFormValues,
} from '@/lib/zod/schemas';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function ResetPasswordCard({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Define your form.
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      oldPassword: 'Admin123',
      newPassword: 'Admin123',
    },
    mode: 'onChange',
  });

  // 2. Define a submit handler.
  function onSubmit(values: ResetPasswordFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (values.oldPassword !== values.newPassword) {
      form.setError('newPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    startTransition(async () => {
      await authClient.resetPassword(
        {
          newPassword: values.newPassword,
          token,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || 'Failed to reset password');
          },
          onSuccess: () => {
            toast.success('Password reset successful', {
              description: 'Redirection to login...',
            });
            setTimeout(() => {
              router.push('/sign-in');
            }, 1000);
          },
        }
      );

      return router.push('/sign-in');
    });
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            Enter your old password and a new password to update your account.
          </p>
          {searchParams.get('error') && (
            <p className={'text-xs text-red-600'}>
              Error: ${searchParams.get('error')}
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='old-password'>Old Password</FormLabel>

                  <FormControl>
                    <Input type='password' placeholder='*******' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='new-password'>New Password</FormLabel>

                  <FormControl>
                    <Input type='password' placeholder='*******' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            <CardAction className={'w-full space-y-2'}>
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </CardAction>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
