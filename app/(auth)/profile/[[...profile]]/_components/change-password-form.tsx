'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRoundIcon } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client/auth-client';
import { cn } from '@/lib/utils';
import {
  type ChangePasswordFormValues,
  changePasswordSchema,
} from '@/lib/zod/schemas';

export default function ChangePasswordForm() {
  const [isChangePasswordPending, startChangePasswordTransition] =
    useTransition();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      revokeOtherSessions: false,
    },
  });

  const { isSubmitting } = form.formState;

  function handlePasswordChange(values: ChangePasswordFormValues) {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error('New passwords do not match');
      form.setError('confirmNewPassword', {
        type: 'manual',
        message: 'New passwords do not match',
      });
      return;
    }

    startChangePasswordTransition(() => {
      toast.promise(
        authClient.changePassword(
          {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            revokeOtherSessions: values.revokeOtherSessions,
          },
          {
            onError: (error) => {
              form.reset();
              throw new Error(
                error.error.message || 'Failed to change password'
              );
            },
          }
        ),
        {
          description: 'Please wait while we update your password.',
          loading: 'Changing password...',
          // eslint-disable-next-line
          success: (data) => {
            form.reset();
            return 'Password changed successfully';
          },
          error: (err: Error) => err.message || 'Failed to change password',
          dismissible: true,
          richColors: true,
        }
      );
    });
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(handlePasswordChange)}>
        <FormField
          control={form.control}
          name='currentPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmNewPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retype new Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='revokeOtherSessions'
          render={({ field }) => (
            <FormItem className='flex'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Log out other sessions</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isChangePasswordPending || isSubmitting ? (
            <span className={cn('inline-flex items-center gap-2')}>
              Changing Password... <Spinner />
            </span>
          ) : (
            <span className={cn('inline-flex items-center gap-2')}>
              Change Password <KeyRoundIcon className={'size-4'} />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
