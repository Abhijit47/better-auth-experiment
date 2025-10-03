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
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { signUpformSchema, SignUpFormValues } from '@/lib/zod/schemas';
import { toast } from 'sonner';

export function SignUpCard() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpformSchema),
    defaultValues: {
      name: 'test1',
      email: 'test@test.com',
      password: 'Admin1234',
      confirmPassword: 'Admin1234',
    },
    mode: 'onChange',
  });

  // 2. Define a submit handler.
  function onSubmit(values: SignUpFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      // console.log(values);
      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: '/sign-in',
        fetchOptions: {
          // eslint-disable-next-line
          onRequest: (ctx) => {
            //show loading
            toast.loading('Creating your account...', { id: 'sign-up' });
          },
          // eslint-disable-next-line
          onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            toast.success('Account created successfully!', { id: 'sign-up' });
            router.push('/sign-in');
          },
          onError: (ctx) => {
            // console.log(ctx.error);
            // display the error message
            toast.error(ctx.error.message || ctx.error.statusText, {
              id: 'sign-up',
            });

            if (ctx.error.code === 'PASSWORD_COMPROMISED') {
              form.setError('password', {
                type: 'manual',
                message: ctx.error.message,
              });
            }
          },
          // hookOptions: {
          //   cloneResponse: true,
          // },
        },
        image: 'https://placehold.co/100x100.png',
      });
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
            <Separator />
            <CardAction className={'w-full space-y-2'}>
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? 'Creating account...' : 'Create Account'}
              </Button>
              <Button variant='outline' className='w-full' disabled={isPending}>
                {isPending ? 'Please wait...' : 'Sign up with Github'}
              </Button>
            </CardAction>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
