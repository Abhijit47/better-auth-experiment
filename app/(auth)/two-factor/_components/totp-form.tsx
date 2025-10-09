'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client';
import { totpFormSchema, TotpFormValues } from '@/lib/zod/schemas';

export default function TotpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<TotpFormValues>({
    resolver: zodResolver(totpFormSchema),
    defaultValues: {
      code: '',
      trustDevice: false,
    },
    mode: 'onChange',
  });

  const { isSubmitting } = form.formState;

  function handleTotpVerification(data: TotpFormValues) {
    setIsLoading(true);
    toast.promise(
      authClient.twoFactor.verifyTotp({
        code: data.code,
        trustDevice: data.trustDevice,
        fetchOptions: {
          onError(context) {
            throw new Error(
              context.error.message || 'Failed to verify TOTP code'
            );
          },
        },
      }),
      {
        description: 'Verifying TOTP code...',
        descriptionClassName: 'text-[10px]',
        loading: 'Verifying TOTP code...',
        // eslint-disable-next-line
        success: ({ data }) => {
          return 'TOTP code verified successfully';
        },
        error: (err: Error) => err.message || 'Failed to verify TOTP code',
        finally: () => {
          setIsLoading(false);
          router.push('/');
          router.refresh();
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(handleTotpVerification)}>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>TOTP Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='trustDevice'
          render={({ field }) => (
            <FormItem className='flex'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                Trust this device (don&apos;t ask for a code again)
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isLoading || isSubmitting}
          className='w-full'>
          {isLoading || isSubmitting ? (
            <span className={'inline-flex items-center gap-2'}>
              Verifying... <Spinner />
            </span>
          ) : (
            <span>Verify</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
