'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
// import { authClient } from '@/lib/auth/auth-client';
import { authClient } from '@/lib/auth/client/auth-client';
import { cn } from '@/lib/utils';
import { signUpFormSchema, SignUpFormValues } from '@/lib/zod/schemas';
import { BetterFetchError } from 'better-auth/react';
import { toast } from 'sonner';

export function SignUpCard() {
  const [usernameAvailable, setUsernameAvailable] = useState('');
  const [isPending, startTransition] = useTransition();
  // const [isSocialPending, startSocialTransition] = useTransition();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: 'test1',
      email: 'test@test.com',
      password: 'Admin123',
      confirmPassword: 'Admin123',
      username: '',
    },
    mode: 'onChange',
  });

  // 2. Define a submit handler.
  function onSubmit(values: SignUpFormValues) {
    const firstAndLastChar =
      values.username.charAt(0) +
      values.username.charAt(values.username.length - 1);

    const imageUrl = `https://avatar.vercel.sh/rauchg.svg?rounded=60&size=60&text=${firstAndLastChar.toUpperCase()}`;

    startTransition(async () => {
      if (values.password !== values.confirmPassword) {
        form.setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match',
        });
        return;
      }

      const { data: response, error } = await authClient.isUsernameAvailable({
        username: values.username,
      });
      if (error) {
        console.log('Error checking username availability', error);
        toast.error(error.message || error.statusText, {
          id: 'username-check',
        });
        return;
      }

      if (response?.available) {
        console.log('Username is available');
        setUsernameAvailable('Username is available');
        const res = await authClient.signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
          username: values.username,
          displayUsername: values.displayUsername,
          callbackURL: '/sign-in',
          image: imageUrl,
          fetchOptions: {
            // eslint-disable-next-line
            onRequest: (ctx) => {
              //show loading
              toast.loading('Creating your account...', {
                id: 'sign-up',
                duration: 3000,
              });
              return;
            },
            // eslint-disable-next-line
            onSuccess: (ctx) => {
              //redirect to the dashboard or sign in page
              toast.success('Account created successfully!', { id: 'sign-up' });
              router.push('/sign-in');
              return;
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || ctx.error.statusText, {
                id: 'sign-up',
              });
              const error = ctx.error as BetterFetchError & { code: string };
              if (error.code === 'PASSWORD_COMPROMISED') {
                form.setError('password', {
                  type: 'manual',
                  message: ctx.error.message,
                });
              }
              return;
            },
            // hookOptions: {
            //   cloneResponse: true,
            // },
          },
        });
        if (res.error == null && !res.data.user.emailVerified) {
          toast.success(
            'A verification email has been sent to your email address.',
            { id: 'email-verification' }
          );
          const encodedEmail = encodeURIComponent(values.email);
          router.push(`/verify-email?email=${encodedEmail}`); // Redirect to the email verification page
        }
        return;
      } else {
        console.log('Username is not available');
        setUsernameAvailable('Username is not available');
        form.setError('username', {
          type: 'manual',
          message: 'Username is not available',
        });
        return;
      }
    });
  }

  return (
    <Card className='w-full max-w-sm gap-4'>
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            Enter your details below to create a new account
          </p>
        </CardDescription>
        <CardAction>
          <Link
            href={'/sign-in'}
            className={cn(buttonVariants({ variant: 'link' }))}>
            Sign In <SquareArrowOutUpRightIcon className='h-4 w-4' />
          </Link>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
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
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your username' {...field} />
                  </FormControl>

                  {usernameAvailable ? (
                    <p className='text-xs text-green-600'>
                      {usernameAvailable}
                    </p>
                  ) : (
                    <FormMessage className={'text-xs'} />
                  )}
                </FormItem>
              )}
            />

            <Separator />
            <CardAction className={'w-full space-y-2'}>
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? 'Creating account...' : 'Continue'}
              </Button>

              <Button type='button' variant='outline' className='w-full'>
                Sign up with Github
              </Button>
            </CardAction>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
