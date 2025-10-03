```javascript
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
import { cn } from '@/lib/utils';
// import { signUpformSchema, SignUpFormValues } from '@/lib/zod/schemas';
// import { toast } from 'sonner';
import z from 'zod';

const signUpInitial = z.object({
  name: z.string().min(2).max(50),
  email: z.email(),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128),
  // username: z.string().min(5).max(50),
  username: z.string(),
  step: z.number().min(1).max(2),
  provider: z.enum(['github', 'discord']).optional(),
});

const signUpFinal = signUpInitial.extend({
  username: z.string().min(5).max(50),
  // displayUsername: z.string().min(5).max(50).optional(),
});

type SignUpFormValues = z.infer<typeof signUpInitial>;

// type SocialProvider = 'github' | 'discord';

export function SignUpCard() {
  // const [step, setStep] = useState(1);
  // const [provider, setProvider] = useState<SocialProvider>();
  const [isSocialSignUp, setIsSocialSignUp] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSocialPending, startSocialTransition] = useTransition();
  const router = useRouter();

  // 1. Define your form.
  const form =
    useForm <
    SignUpFormValues >
    {
      resolver: zodResolver(signUpInitial),
      defaultValues: {
        name: 'test1',
        email: 'test@test.com',
        password: 'Admin1234',
        confirmPassword: 'Admin1234',
        username: 'Test123',
        // displayUsername: 'fdsdfsdfsdf',
        step: 1,
        provider: undefined,
      },
      mode: 'onChange',
    };

  // 2. Define a submit handler.
  function onSubmit(values: SignUpFormValues) {
    console.log('values', values);
    console.log('err', form.formState);
    // const parsed = signUpFinal.safeParse(values);
    // if (!parsed.success) {
    //   toast.error('Please fix the errors in the form.');
    //   console.log(parsed.error);
    //   return;
    // }

    if (!values.provider) {
      startTransition(async () => {
        if (values.password !== values.confirmPassword) {
          form.setError('confirmPassword', {
            type: 'manual',
            message: 'Passwords do not match',
          });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // setStep(2);

        /*1. */
        // await authClient.isUsernameAvailable({
        //   username: values.username,
        //   fetchOptions: {
        //     onRequest(context) {
        //       console.log('Checking username availability...', context);
        //       toast.loading('Checking username availability...', {
        //         id: 'username-check',
        //       });
        //       return;
        //     },
        //     onSuccess(context) {
        //       console.log('Username availability response', context.response);
        //       toast.success('Username is available', { id: 'username-check' });
        //       return;
        //     },
        //     onError(context) {
        //       console.log('Error checking username availability', context.error);
        //       toast.error(context.error.message || context.error.statusText, {
        //         id: 'username-check',
        //       });
        //       return;
        //     },
        //   },
        // });
        /*2. */
        // await authClient.signUp.email({
        //   name: values.name,
        //   email: values.email,
        //   password: values.password,
        //   username: values.username,
        //   displayUsername: values.displayUsername,
        //   callbackURL: '/sign-in',
        //   fetchOptions: {
        //     // // eslint-disable-next-line
        //     onRequest: (ctx) => {
        //       //show loading
        //       const body = ctx.body;
        //       console.log('Request body: ', body);
        //       toast.loading('Creating your account...', {
        //         id: 'sign-up',
        //         duration: 3000,
        //       });
        //       return;
        //     },
        //     // eslint-disable-next-line
        //     onSuccess: (ctx) => {
        //       //redirect to the dashboard or sign in page
        //       toast.success('Account created successfully!', { id: 'sign-up' });
        //       router.push('/sign-in');
        //     },
        //     onError: (ctx) => {
        //       // console.log(ctx.error);
        //       // display the error message
        //       toast.error(ctx.error.message || ctx.error.statusText, {
        //         id: 'sign-up',
        //       });

        //       if (ctx.error.code === 'PASSWORD_COMPROMISED') {
        //         form.setError('password', {
        //           type: 'manual',
        //           message: ctx.error.message,
        //         });
        //       }
        //     },
        //     // hookOptions: {
        //     //   cloneResponse: true,
        //     // },
        //   },
        //   image: 'https://placehold.co/100x100.png',
        // });
      });
    }

    if (values.provider === 'github') {
      console.log('Social Sign Up with ', values.provider);
      startSocialTransition(async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // setProvider('github');
        // setStep(2);
        return;
      });
    }
  }

  const step = form.watch('step');
  const provider = form.watch('provider');

  return (
    <Card className='w-full max-w-sm gap-4'>
      <CardHeader>
        {provider}
        <CardTitle>
          {step === 1 ? 'Create a new account' : 'Almost there!'}
        </CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            {step === 1
              ? 'Enter your details below to create a new account'
              : 'Choose a username for your account'}
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
            {step === 1 ? (
              <>
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
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
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
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter your username' {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Separator />
            <CardAction className={'w-full space-y-2'}>
              {step === 1 ? (
                <Button
                  type='button'
                  onClick={() => {
                    form.setValue('step', 2, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    setIsSocialSignUp(true);
                    // form.clearErrors();
                  }}
                  className='w-full'
                  disabled={isPending}>
                  {isPending ? 'Creating account...' : 'Continue'}
                </Button>
              ) : (
                <Button className='w-full' type='submit' disabled={isPending}>
                  {isPending ? 'Creating account...' : 'Sign Up'}
                </Button>
              )}

              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={() => {
                  form.setValue('step', 2, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  form.setValue('provider', 'github', {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
                disabled={isSocialPending || isSocialSignUp}>
                {isSocialPending ? 'Please wait...' : 'Sign up with Github'}
              </Button>
            </CardAction>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```
