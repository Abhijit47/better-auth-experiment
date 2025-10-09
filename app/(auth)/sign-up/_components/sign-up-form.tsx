import { zodResolver } from '@hookform/resolvers/zod';
import { type BetterFetchError } from 'better-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { CardAction } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client/auth-client';
import { signUpFormSchema, SignUpFormValues } from '@/lib/zod/schemas';

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: 'test1',
      email: 'test@test.com',
      password: 'Admin123',
      confirmPassword: 'Admin123',
    },
    mode: 'onChange',
  });

  function onSubmit(values: SignUpFormValues) {
    setIsLoading(true);
    const firstAndLastChar =
      values.name.charAt(0) + values.name.charAt(values.name.length - 1);

    const imageUrl = `https://avatar.vercel.sh/rauchg.svg?rounded=60&size=60&text=${firstAndLastChar.toUpperCase()}`;

    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    toast.promise(
      authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: '/sign-up-complete',
        favoriteNumber: 0,
        image: imageUrl,
        fetchOptions: {
          onError: (ctx) => {
            console.log('Error signing up:', ctx.error);
            const error = ctx.error as BetterFetchError & { code: string };
            if (error.code === 'PASSWORD_COMPROMISED') {
              form.setError('password', {
                type: 'manual',
                message:
                  ctx.error.message ||
                  'Your password has been compromised in a data breach. Please choose a different password.',
              });
              throw new Error(error.message);
            }
            throw new Error(ctx.error.message);
          },
          // hookOptions: {
          //   cloneResponse: true,
          // },
        },
      }),
      {
        description: 'Creating your account...',
        descriptionClassName: 'text-[10px]',
        loading: 'Creating your account...',
        success: (ctx) => {
          if (ctx.error == null && !ctx.data.user.emailVerified) {
            const encodedEmail = encodeURIComponent(values.email);
            // Redirect to the email verification page
            router.push(`/verify-email?email=${encodedEmail}`);
            return 'A verification email has been sent to your email address.';
          }
          return 'Account created successfully!';
        },
        error: (err: Error) => err.message || 'Error creating account',
        finally: () => {
          setIsLoading(false);
          form.reset();
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          disabled={isLoading}
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your name' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center'>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <Link
                  href='/forgot-password'
                  className='ml-auto inline-block text-xs underline-offset-4 hover:underline'>
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type='password' placeholder='*******' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='*******' {...field} />
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
                Creating account...
                <Spinner />
              </span>
            ) : (
              'Sign Up'
            )}
          </Button>
        </CardAction>
      </form>
    </Form>
  );
}
