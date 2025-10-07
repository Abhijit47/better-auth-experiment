'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyholeIcon, LockKeyholeOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
import { authClient } from '@/lib/auth/auth-client';
import {
  twoFactorAuthFormSchema,
  type TwoFactorAuthFormValues,
} from '@/lib/zod/schemas';
import { LazyQRCodeVerifyForm } from '.';

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

interface TwoFactorAuthFormProps {
  isEnabled: boolean;
}

export default function TwoFactorAuthForm(props: TwoFactorAuthFormProps) {
  const { isEnabled } = props;

  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null
  );
  const [isEnabledPending, startEnableTransition] = useTransition();
  const [isDisabledPending, startDisableTransition] = useTransition();

  const router = useRouter();
  const form = useForm<TwoFactorAuthFormValues>({
    resolver: zodResolver(twoFactorAuthFormSchema),
    defaultValues: { password: '' },
  });

  function handleDisableTwoFactorAuth(data: TwoFactorAuthFormValues) {
    startDisableTransition(async () => {
      await authClient.twoFactor.disable(
        {
          password: data.password,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || 'Failed to disable 2FA');
          },
          onSuccess: () => {
            form.reset();
            router.refresh();
          },
        }
      );
    });
  }

  function handleEnableTwoFactorAuth(data: TwoFactorAuthFormValues) {
    startEnableTransition(async () => {
      const result = await authClient.twoFactor.enable({
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to enable 2FA');
      }
      {
        setTwoFactorData(result.data);
        form.reset();
      }
    });
  }

  if (twoFactorData != null) {
    return (
      <LazyQRCodeVerifyForm
        {...twoFactorData}
        onDone={() => {
          setTwoFactorData(null);
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(
          isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth
        )}>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isEnabled ? isDisabledPending : isEnabledPending}
          className='w-full'
          variant={isEnabled ? 'destructive' : 'default'}>
          {/* <LoadingSwap isLoading={isSubmitting}>
            {isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </LoadingSwap> */}
          {isEnabledPending || isDisabledPending ? (
            <span className='inline-flex items-center gap-2'>
              Processing... <Spinner />
            </span>
          ) : isEnabled ? (
            <span className='inline-flex items-center gap-2'>
              Disable 2FA <LockKeyholeOpen className={'size-4'} />
            </span>
          ) : (
            <span className='inline-flex items-center gap-2'>
              Enable 2FA <LockKeyholeIcon className={'size-4'} />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
