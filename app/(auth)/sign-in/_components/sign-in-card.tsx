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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth/client/auth-client';
import {
  SignInWithEmailFormValues,
  signInWithEmailSchema,
  SignInWithUsernameFormValues,
  signInWithUsernameSchema,
} from '@/lib/zod/schemas';
import { toast } from 'sonner';

type TabType = 'email' | 'username';

export function SignInCard() {
  const [tab, setTab] = useState<TabType>('email');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<
    SignInWithEmailFormValues | SignInWithUsernameFormValues
  >({
    resolver: zodResolver(
      tab === 'email' ? signInWithEmailSchema : signInWithUsernameSchema
    ),
    defaultValues:
      tab === 'email'
        ? {
            email: 'test@test.com',
            password: 'Admin123852456',
          }
        : {
            username: 'testuser',
            upassword: 'Admin123852456',
          },
    mode: 'onChange',
  });

  function toggleTab() {
    setTab((tab) => (tab === 'email' ? 'username' : 'email'));
  }

  // 2. Define a submit handler.
  function onSubmit(
    values: SignInWithEmailFormValues | SignInWithUsernameFormValues
  ) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const loginWithEmail = values as SignInWithEmailFormValues;
    const loginWithUsername = values as SignInWithUsernameFormValues;

    startTransition(async () => {
      switch (tab) {
        case 'email': {
          const res = await authClient.signIn.email({
            email: loginWithEmail.email,
            password: loginWithEmail.password,
            // callbackURL: '/',
            rememberMe: true,
            fetchOptions: {
              // eslint-disable-next-line
              onRequest: (ctx) => {
                //show loading
                toast.loading('Logging your account...', {
                  id: 'sign-in-email',
                  duration: 3000,
                  closeButton: true,
                });
                return;
              },
              onError(context) {
                // console.log('Error signing in:', context.error);
                toast.error(context.error.message || 'Failed to sign in user');
                form.setError('email', {
                  type: 'value',
                  message: context.error.message,
                });
                return;
              },
              // eslint-disable-next-line
              onSuccess(context) {
                toast.success('Successfully signed in!');
                // return router.push('/');
                return;
              },
            },
          });

          if (res.error === null && !res.data.user.emailVerified) {
            toast.success(
              'A verification email has been sent to your email address.',
              { id: 'email-verification' }
            );
            const encodedEmail = encodeURIComponent(loginWithEmail.email);
            router.push(`/verify-email?email=${encodedEmail}`); // Redirect to the email verification page
          } else {
            router.push('/'); // Redirect to the homepage or dashboard after successful sign-in
            return router.refresh();
          }

          break;
        }

        case 'username': {
          if (!loginWithUsername.username) {
            form.setError(
              'username',
              {
                type: 'validate',
                message: 'Username is required',
              },
              { shouldFocus: true }
            );
            return;
          }

          const res = await authClient.signIn.username({
            username: loginWithUsername.username,
            password: loginWithUsername.upassword,
            rememberMe: true,
            // callbackURL: '/',
            fetchOptions: {
              // eslint-disable-next-line
              onRequest: (ctx) => {
                //show loading
                toast.loading('Logging your account...', {
                  id: 'sign-in-username',
                  duration: 3000,
                  closeButton: true,
                });
                return;
              },
              onError(context) {
                // console.log('Error signing in:', context.error);
                toast.error(
                  context.error.message || 'Failed to sign in with username'
                );
                form.setError('email', {
                  type: 'value',
                  message: context.error.message,
                });
                return;
              },
              // eslint-disable-next-line
              onSuccess(context) {
                toast.success('Successfully signed in!');
                // return router.push('/');
                return;
              },
            },
          });

          if (res.error === null && !res.data.user.emailVerified) {
            toast.success(
              'A verification email has been sent to your email address.',
              { id: 'email-verification' }
            );
            const encodedEmail = encodeURIComponent(res.data.user.email);
            router.push(`/verify-email?email=${encodedEmail}`); // Redirect to the email verification page
          } else if (
            (res.error !== null && res.error.code) ===
            'INVALID_USERNAME_OR_PASSWORD'
          ) {
            form.setError('username', {
              type: 'value',
              message: res.error?.message,
            });
            return;
          } else if (
            (res.error !== null && res.error.code) === 'VALIDATION_ERROR'
          ) {
            form.setError('username', {
              type: 'value',
              message: res.error?.message,
            });
            return;
          } else {
            router.push('/'); // Redirect to the homepage or dashboard after successful sign-in
            return router.refresh();
          }
          break;
        }

        default: {
          toast.error('Invalid tab');
          break;
        }
      }
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
        <Tabs defaultValue={tab} onValueChange={toggleTab}>
          <TabsList className={'w-full'}>
            <TabsTrigger value='email'>Email</TabsTrigger>
            <TabsTrigger value='username'>Username</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value='email' className='space-y-4'>
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
                        <Input
                          type='password'
                          placeholder='*******'
                          {...field}
                        />
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
                  <Button
                    variant='outline'
                    className='w-full'
                    disabled={isPending}>
                    Login with Github
                  </Button>
                </CardAction>
                {/* </form>
            </Form> */}
              </TabsContent>

              <TabsContent value='username' className='space-y-4'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='your username'
                          // {...field}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          disabled={field.disabled}
                          defaultValue={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value.trim());
                            form.setValue('username', e.target.value.trim(), {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='upassword'
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
                        <Input
                          type='password'
                          placeholder='*******'
                          {...field}
                        />
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
                  <Button
                    variant='outline'
                    className='w-full'
                    disabled={isPending}>
                    Login with Github
                  </Button>
                </CardAction>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
