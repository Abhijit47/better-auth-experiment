import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
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
import { authClient } from '@/lib/auth/client';
import {
  SignUpCompleteFormValues,
  signUpCompleteSchema,
} from '@/lib/zod/schemas';

export default function SignUpCompleteForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState('');
  const router = useRouter();

  const form = useForm<SignUpCompleteFormValues>({
    resolver: zodResolver(signUpCompleteSchema),
    defaultValues: {
      username: '',
      displayUsername: '',
      favoriteNumber: String(1),
    },
    mode: 'onChange',
  });

  function onSubmit(values: SignUpCompleteFormValues) {
    setIsLoading(true);
    toast.promise(
      authClient.isUsernameAvailable({
        username: values.username,
        fetchOptions: {
          onError(ctx) {
            throw new Error(
              ctx.error.message || 'Error checking username availability'
            );
          },
        },
      }),
      {
        loading: 'Checking username availability...',
        success({ data }) {
          if (data?.available) {
            setUsernameAvailable(values.username);

            toast.promise(
              authClient.updateUser({
                username: values.username,
                displayUsername: values.displayUsername,
                favoriteNumber: Number(values.favoriteNumber),
              }),
              {
                loading: 'Updating username...',
                success: 'Username updated!',
                error: 'Error updating username',
                finally: () => {
                  setIsLoading(false);
                  router.push('/sign-in');
                },
              }
            );
            return 'Username updated! Redirecting to sign in...';
          } else {
            setUsernameAvailable('');
            form.setError('username', {
              type: 'manual',
              message: `${values.username} is already taken.`,
            });
            throw new Error(`Username ${values.username} is already taken.`);
          }
        },
        error: (err: Error) =>
          err.message || 'Error checking username availability',
        finally: () => setIsLoading(false),
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          disabled={isLoading}
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Provide username' {...field} />
              </FormControl>

              {usernameAvailable ? (
                <p className='text-xs text-green-600 flex items-center gap-1'>
                  <CheckCircle2 className={'size-3'} /> {usernameAvailable} is
                  available!
                </p>
              ) : (
                <FormMessage className={'text-xs'} />
              )}
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name='displayUsername'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Username (optional)</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Provide display username'
                  {...field}
                />
              </FormControl>

              <FormMessage className={'text-xs'} />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name='favoriteNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Number</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Provide favorite number'
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
                Creating account...
                <Spinner />
              </span>
            ) : (
              'Complete Sign Up'
            )}
          </Button>
        </CardAction>
      </form>
    </Form>
  );
}
