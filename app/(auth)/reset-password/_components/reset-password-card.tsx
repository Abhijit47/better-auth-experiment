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
import {
  resetPasswordFormSchema,
  ResetPasswordFormValues,
} from '@/lib/zod/schemas';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function ResetPasswordCard() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      oldPassword: 'Admin1234',
      newPassword: 'Admin1234',
    },
    mode: 'onChange',
  });

  // 2. Define a submit handler.
  function onSubmit(values: ResetPasswordFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      console.log(values);
      // simulate async action
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
