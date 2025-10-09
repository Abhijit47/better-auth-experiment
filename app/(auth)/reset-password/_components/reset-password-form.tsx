import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth/client';
import {
  resetPasswordFormSchema,
  ResetPasswordFormValues,
} from '@/lib/zod/schemas';

import { Button } from '@/components/ui/button';
import { CardAction } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';

import InputWithPasswordVisible from '@/components/extends/input-with-password-visible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: 'Admin123',
      confirmNewPassword: 'Admin123',
    },
    mode: 'onChange',
  });

  function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true);

    if (values.newPassword !== values.confirmNewPassword) {
      form.setError('confirmNewPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    toast.promise(
      authClient.resetPassword({
        newPassword: values.newPassword,
        token,
        fetchOptions: {
          onError: (error) => {
            throw new Error(error.error.message || 'Failed to reset password');
          },
        },
      }),
      {
        description: 'Please wait...',
        descriptionClassName: 'text-[10px]',
        loading: 'Resetting password...',
        success: () => {
          setTimeout(() => {
            router.push('/sign-in');
          }, 1000);
          return 'Password reset successful. Redirecting to login...';
        },
        error: (err: Error) => err.message || 'Failed to reset password',
        finally: () => {
          setIsLoading(false);
        },
      }
    );

    // startTransition(async () => {
    //   await authClient.resetPassword(
    //     {
    //       newPassword: values.newPassword,
    //       token,
    //     },
    //     {
    //       onError: (error) => {
    //         toast.error(error.error.message || 'Failed to reset password');
    //       },
    //       onSuccess: () => {
    //         toast.success('Password reset successful', {
    //           description: 'Redirection to login...',
    //         });
    //         setTimeout(() => {
    //           router.push('/sign-in');
    //         }, 1000);
    //       },
    //     }
    //   );

    //   return router.push('/sign-in');
    // });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          disabled={isLoading}
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='new-password'>New Password</FormLabel>

              <FormControl>
                <InputWithPasswordVisible {...field} />
                {/* <Input
                  id='new-password'
                  type='password'
                  placeholder='*******'
                  {...field}
                /> */}
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name='confirmNewPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='confirm-new-password'>
                Confirm New Password
              </FormLabel>

              <FormControl>
                <InputWithPasswordVisible {...field} />
                {/* <Input
                  id='confirm-new-password'
                  type='password'
                  placeholder='*******'
                  {...field}
                /> */}
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <CardAction className={'w-full space-y-2'}>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? (
              <span className={'inline-flex items-center gap-2'}>
                Updating... <Spinner />
              </span>
            ) : (
              'Update your password'
            )}
          </Button>
        </CardAction>
      </form>
    </Form>
  );
}
