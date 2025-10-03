'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/auth-client';
import { signInFormSchema, SignInFormValues } from '@/lib/zod/schemas';
import { toast } from 'sonner';

export function SignInCard() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: 'test@test.com',
      password: 'Admin1234',
    },
    mode: 'onChange',
  });

  // 2. Define a submit handler.
  function onSubmit(values: SignInFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      console.log(values);
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: 'user@example.com', // required
        type: 'sign-in', // required
        fetchOptions: {},
      });
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/',
        rememberMe: true,
        fetchOptions: {
          onError(context) {
            console.log('Error signing in:', context.error);
            toast.error(context.error.message || 'Error signing in');
            form.setError('email', {
              type: 'value',
              message: context.error.message,
            });
            return;
          },
          onSuccess(context) {
            console.log('Successfully signed in:', context);
            toast.success('Successfully signed in!');
            return router.push('/');
          },
        },
      });
      // simulate async action
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // return router.push('/');
    });
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            Enter your email below to login to your account
          </p>
        </CardDescription>
        <CardAction>
          <Link
            href={'/sign-up'}
            className={cn(buttonVariants({ variant: 'link' }))}>
            Sign Up <SquareArrowOutUpRightIcon className='h-4 w-4' />
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

            <Separator />
            <CardAction className={'w-full space-y-2'}>
              <Button type='submit' className='w-full' disabled={isPending}>
                Sign In
              </Button>
              <Button variant='outline' className='w-full' disabled={isPending}>
                Login with Github
              </Button>
            </CardAction>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
