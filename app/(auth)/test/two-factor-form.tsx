'use client';

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyholeIcon, LockKeyholeOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { authClient } from '@/lib/auth/client/auth-client';
import {
  twoFactorAuthFormSchema,
  type TwoFactorAuthFormValues,
} from '@/lib/zod/schemas';
import QRCodeForm from './qr-code-verify-form';

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

interface TwoFactorAuthFormProps {
  isEnabled: boolean;
}

export default function TwoFactorForm(props: TwoFactorAuthFormProps) {
  const { isEnabled } = props;

  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null
  );
  const [isEnableLoading, setIsEnableLoading] = useState(false);
  const [isDisableLoading, setIsDisableLoading] = useState(false);

  const router = useRouter();
  const form = useForm<TwoFactorAuthFormValues>({
    resolver: zodResolver(twoFactorAuthFormSchema),
    defaultValues: { password: 'Admin123852456' },
  });

  function handleDisableTwoFactorAuth(data: TwoFactorAuthFormValues) {
    setIsDisableLoading(true);

    toast.promise(
      authClient.twoFactor.disable({
        password: data.password,
        fetchOptions: {
          onError: (error) => {
            throw new Error(error.error.message || 'Failed to disable 2FA');
          },
        },
      }),
      {
        description: 'This action cannot be undone.',
        descriptionClassName: 'text-[10px]',
        loading: 'Disabling 2FA...',
        success: () => {
          form.reset();
          router.refresh();
          return '2FA disabled successfully';
        },
        error: (err: Error) => err?.message || 'Failed to disable 2FA',
        finally: () => setIsDisableLoading(false),
      }
    );
  }

  function handleEnableTwoFactorAuth(data: TwoFactorAuthFormValues) {
    setIsEnableLoading(true);

    toast.promise(
      authClient.twoFactor.enable({
        password: data.password,
        issuer: 'BetterAuth Demo',
        fetchOptions: {
          onError(ctx) {
            throw new Error(ctx.error.message || 'Failed to enable 2FA');
          },
        },
      }),
      {
        description: 'You will need to verify your identity.',
        descriptionClassName: 'text-[10px]',
        loading: 'Enabling 2FA...',
        success: ({ data }) => {
          setTwoFactorData(data);
          form.reset();
          return 'Waiting for you to verify your identity...';
        },
        error: (err: Error) => err?.message || 'Failed to enable 2FA',
        finally: () => setIsEnableLoading(false),
      }
    );
  }

  if (twoFactorData != null) {
    return (
      <QRCodeForm
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
          disabled={isEnabled ? isDisableLoading : isEnableLoading}
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
          disabled={isEnabled ? isDisableLoading : isEnableLoading}
          className='w-full'
          variant={isEnabled ? 'destructive' : 'default'}>
          {/* <LoadingSwap isLoading={isSubmitting}>
            {isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </LoadingSwap> */}
          {isEnableLoading || isDisableLoading ? (
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
