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
import { authClient } from '@/lib/auth/client/auth-client';
import {
  SignInWithEmailFormValues,
  signInWithEmailSchema,
} from '@/lib/zod/schemas';

interface SignWithEmailProps {
  isLoading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
}

export default function SignWithEmailForm(props: SignWithEmailProps) {
  const { isLoading, onLoading } = props;

  const router = useRouter();

  const form = useForm<SignInWithEmailFormValues>({
    resolver: zodResolver(signInWithEmailSchema),
    defaultValues: {
      email: 'test@test.com',
      password: 'Admin123852456',
    },
    mode: 'onChange',
  });

  function onSubmit(values: SignInWithEmailFormValues) {
    onLoading(true);

    const loginWithEmail = values as SignInWithEmailFormValues;

    toast.promise(
      authClient.signIn.email({
        email: loginWithEmail.email,
        password: loginWithEmail.password,
        // callbackURL: '/',
        rememberMe: true,
        fetchOptions: {
          onError(context) {
            form.setError('email', {
              type: 'value',
              message: context.error.message || 'Failed to sign in user',
            });
            throw new Error(context.error.message || 'Failed to sign in user');
          },
        },
      }),
      {
        description: 'Please wait a moment...',
        descriptionClassName: 'text-[10px]',
        loading: 'Logging your account...',
        success: (data) => {
          if (data.error === null && !data.data.user.emailVerified) {
            const encodedEmail = encodeURIComponent(loginWithEmail.email);
            router.push(`/verify-email?email=${encodedEmail}`); // Redirect to the email verification page
            return 'A verification email has been sent to your email address.';
          } else {
            router.push('/'); // Redirect to the homepage or dashboard after successful sign-in
            router.refresh();
          }
          return 'Successfully signed in!';
        },
        error: (error: Error) => error.message || 'Failed to sign in user',
        finally() {
          onLoading(false);
        },
      }
    );

    // Temporary mockup for loading state
    // toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
    //   description: 'Signing in with email...',
    //   descriptionClassName: 'text-[10px]',
    //   loading: 'Signing in with email...',
    //   success: () => {
    //     console.log('loginWithEmail', loginWithEmail);
    //     router.refresh();
    //     return 'Signed in with email successfully';
    //   },
    //   error: 'Failed to sign in with email',
    //   finally() {
    //     setIsLoading(false);
    //   },
    // });
  }

  return (
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
                    disabled={isLoading}
                    type='email'
                    placeholder='someone@example.com'
                    {...field}
                  />
                </FormControl>

                <FormMessage className={'text-xs'} />
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
                'Sign in with email'
              )}
            </Button>
          </CardAction>
        </TabsContent>
      </form>
    </Form>
  );
}
