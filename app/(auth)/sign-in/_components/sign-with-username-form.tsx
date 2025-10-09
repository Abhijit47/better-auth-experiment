import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
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
import { TabsContent } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth/client';
import {
  SignInWithUsernameFormValues,
  signInWithUsernameSchema,
} from '@/lib/zod/schemas';

interface SignWithUsernameProps {
  isLoading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
}

export default function SignWithUsernameForm(props: SignWithUsernameProps) {
  const { isLoading, onLoading } = props;

  const router = useRouter();

  const form = useForm<SignInWithUsernameFormValues>({
    resolver: zodResolver(signInWithUsernameSchema),
    defaultValues: {
      username: 'testuser1',
      upassword: 'Admin123852456',
    },
    mode: 'onChange',
  });

  function onSubmit(values: SignInWithUsernameFormValues) {
    onLoading(true);
    const loginWithUsername = values as SignInWithUsernameFormValues;

    if (!loginWithUsername.username) {
      form.setError(
        'username',
        {
          type: 'required',
          message: 'Username is required',
        },
        { shouldFocus: true }
      );
      return;
    }

    toast.promise(
      authClient.signIn.username({
        username: loginWithUsername.username,
        password: loginWithUsername.upassword,
        rememberMe: true,
        // callbackURL: '/',
        fetchOptions: {
          onError(ctx) {
            console.log('Error signing in:', ctx.error);
            form.setError('username', {
              type: 'value',
              message: ctx.error.message || 'Failed to sign in with username',
            });
            throw new Error(
              ctx.error.message || 'Failed to sign in with username'
            );
          },
        },
      }),
      {
        description: 'Please wait a moment...',
        descriptionClassName: 'text-[10px]',
        loading: 'Logging your account...',
        success: (data) => {
          if (data.error === null && !data.data.user.emailVerified) {
            const encodedEmail = encodeURIComponent(data.data.user.email);
            router.push(`/verify-email?email=${encodedEmail}`); // Redirect to the email verification page
            return 'A verification email has been sent to your email address.';
          } else if (
            (data.error !== null && data.error.code) ===
            'INVALID_USERNAME_OR_PASSWORD'
          ) {
            form.setError('username', {
              type: 'value',
              message: data.error?.message || 'Failed to sign in with username',
            });
            return data.error?.message || 'Failed to sign in with username';
          } else if (
            (data.error !== null && data.error.code) === 'VALIDATION_ERROR'
          ) {
            form.setError('username', {
              type: 'value',
              message: data.error?.message,
            });
            return data.error?.message || 'Failed to sign in with username';
          } else {
            router.push('/'); // Redirect to the homepage or dashboard after successful sign-in
            router.refresh();
          }
          return 'Successfully signed in!';
        },
        error: (error: Error) =>
          error.message || 'Failed to sign in with username',
        finally() {
          onLoading(false);
        },
      }
    );

    // Temporary mockup for loading state
    // toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
    //   description: 'Signing in with username...',
    //   descriptionClassName: 'text-[10px]',
    //   loading: 'Signing in with username...',
    //   success: () => {
    //     console.log('loginWithUsername', loginWithUsername);
    //     router.refresh();
    //     return 'Signed in with username successfully';
    //   },
    //   error: 'Failed to sign in with username',
    //   finally() {
    //     setIsLoading(false);
    //   },
    // });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TabsContent value='username' className='space-y-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type='text'
                    placeholder='your username'
                    {...field}
                  />
                </FormControl>

                <FormMessage className={'text-xs'} />
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
                    disabled={isLoading}
                    type='password'
                    placeholder='*******'
                    {...field}
                  />
                </FormControl>

                <FormMessage className={'text-xs'} />
              </FormItem>
            )}
          />

          <Separator />

          <CardAction className={'w-full space-y-2'}>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <span className={'inline-flex items-center gap-2'}>
                  Processing... <Spinner className={'size-4'} />
                </span>
              ) : (
                'Sign in with username'
              )}
            </Button>
          </CardAction>
        </TabsContent>
      </form>
    </Form>
  );
}
