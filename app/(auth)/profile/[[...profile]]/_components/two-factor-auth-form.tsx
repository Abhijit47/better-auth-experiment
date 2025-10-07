'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyholeIcon, LockKeyholeOpen } from 'lucide-react';

const twoFactorAuthFormSchema = z.object({
  password: z.string().min(1),
});

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthFormSchema>;
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
  const form = useForm<TwoFactorAuthForm>({
    resolver: zodResolver(twoFactorAuthFormSchema),
    defaultValues: { password: '' },
  });

  function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
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

  function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
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
      <QRCodeVerify
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

const qrSchema = z.object({
  token: z.string().length(6),
});

type QrForm = z.infer<typeof qrSchema>;

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const router = useRouter();
  const form = useForm<QrForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: { token: '' },
  });

  const { isSubmitting } = form.formState;

  function handleQrCode(data: QrForm) {
    startTransition(async () => {
      await authClient.twoFactor.verifyTotp(
        {
          code: data.token,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || 'Failed to verify code');
          },
          onSuccess: () => {
            setSuccessfullyEnabled(true);
            router.refresh();
          },
        }
      );
    });
  }

  if (successfullyEnabled) {
    return (
      <Card>
        <CardDescription>
          <p className='text-sm text-muted-foreground mb-2'>
            Save these backup codes in a safe place. You can use them to access
            your account.
          </p>
        </CardDescription>
        <CardContent>
          <div className='grid grid-cols-2 gap-2 mb-4'>
            {backupCodes.map((code, index) => (
              <div key={index} className='font-mono text-sm'>
                {code}
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <CardAction>
            <Button variant='outline' onClick={onDone}>
              Done
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      <p className='text-muted-foreground'>
        Scan this QR code with your authenticator app and enter the code below:
      </p>

      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(handleQrCode)}>
          <FormField
            control={form.control}
            name='token'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={isSubmitting || isPending}
            className='w-full'>
            {isSubmitting || isPending ? (
              <span>
                Verifying... <Spinner />
              </span>
            ) : (
              'Submit Code'
            )}
          </Button>
        </form>
      </Form>
      <div className='p-4 bg-white w-fit'>
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  );
}
