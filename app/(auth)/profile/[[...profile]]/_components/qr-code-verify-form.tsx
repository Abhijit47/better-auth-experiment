import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { authClient } from '@/lib/auth/client';
import {
  qrCodeVerifyFormSchema,
  type QrCodeVerifyFormValues,
} from '@/lib/zod/schemas';
import BackupCodesCard from './backup-codes-card';

interface QRCodeVerifyFormProps {
  totpURI: string;
  backupCodes: string[];
  onDone: () => void;
}

export default function QRCodeVerifyForm(props: QRCodeVerifyFormProps) {
  const { totpURI, backupCodes, onDone } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const router = useRouter();
  const form = useForm<QrCodeVerifyFormValues>({
    resolver: zodResolver(qrCodeVerifyFormSchema),
    defaultValues: { twoFactorCode: '' },
  });

  const { isSubmitting } = form.formState;

  function onSubmit() {
    setIsLoading(true);
    toast.promise(
      authClient.twoFactor.verifyTotp({
        code: form.getValues('twoFactorCode'),
        trustDevice: true,
        fetchOptions: {
          onError: (ctx) => {
            console.log(ctx.error);
            throw new Error(ctx.error.message || 'Failed to verify code');
          },
        },
      }),
      {
        description: 'Please wait...',
        descriptionClassName: 'text-[10px]',
        loading: 'Verifying code...',
        success: (ctx) => {
          console.log({ ctx });
          setSuccessfullyEnabled(true);
          router.refresh();
          return '2FA enabled successfully!';
        },
        error: (error: Error) => error.message || 'Failed to verify code',
        finally: () => {
          setIsLoading(false);
          // setSuccessfullyEnabled(true);
          // router.refresh();
        },
      }
    );
  }

  if (successfullyEnabled) {
    return <BackupCodesCard backupCodes={backupCodes} onDone={onDone} />;
  }

  return (
    <Card className='py-4 gap-4'>
      <CardHeader>
        <CardDescription>
          <p className='text-muted-foreground'>
            Scan this QR code with your authenticator app and enter the code
            below:
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              disabled={isSubmitting || isLoading}
              control={form.control}
              name='twoFactorCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2FA Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              disabled={isSubmitting || isLoading}
              className='w-full'>
              {isSubmitting || isLoading ? (
                <span className={'inline-flex items-center gap-2'}>
                  Verifying... <Spinner />
                </span>
              ) : (
                'Submit Code'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardContent>
        <div className='p-4 bg-card-foreground/70 rounded-lg w-full mx-auto'>
          <QRCode
            title='2FA QR Code'
            size={256}
            value={totpURI}
            // bgColor='WindowFrame'
            // fgColor='Highlight'
            level='H'
          />
        </div>
      </CardContent>
    </Card>
  );
}
