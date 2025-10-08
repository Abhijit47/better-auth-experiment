import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/ui/button';
import { CardAction } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/client/auth-client';
import { cn } from '@/lib/utils';
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormValues,
} from '@/lib/zod/schemas';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const router = useRouter();
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

  function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);

    toast.promise(
      authClient.forgetPassword({
        email: values.email,
        redirectTo: `/reset-password`,
        fetchOptions: {
          onError(ctx) {
            throw new Error(
              ctx.error.message ||
                'Failed to send reset email. Please try again.'
            );
          },
        },
      }),
      {
        description: 'You will receive a reset link if your email is valid.',
        descriptionClassName: 'text-[10px]',
        loading: 'Sending reset link...',
        success: ({ data }) => {
          if (data?.status) {
            setTimeout(() => {
              currenWindowClose();
            }, 1200);
          }
          return 'Password reset link sent! Please check your email.';
        },
        error: (err: Error) => err.message || 'Something went wrong.',
        finally: () => {
          setIsLoading(false);
          form.reset();
        },
      }
    );
    // startTransition(async () => {

    //   await authClient.forgetPassword({
    //     email: values.email,
    //     redirectTo: `/reset-password`,
    //     fetchOptions: {
    //       onError(context) {
    //         // console.log('Forgot password error', context);
    //         toast.error(
    //           context.error.message ||
    //             'Failed to send reset email. Please try again.'
    //         );
    //         return;
    //       },
    //       // eslint-disable-next-line
    //       onSuccess(context) {
    //         // console.log('Forgot password success', context);
    //         // context.response.json()
    //         toast.success('Password reset link sent! Please check your email.');
    //         setTimeout(() => {
    //           currenWindowClose();
    //         }, 1200);
    //         return;
    //       },
    //     },
    //   });
    // });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          disabled={isLoading}
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
          <Button asChild disabled={isLoading}>
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
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </CardAction>
      </form>
    </Form>
  );
}
