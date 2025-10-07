import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

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
import {
  qrCodeVerifyFormSchema,
  QrCodeVerifyFormValues,
} from '@/lib/zod/schemas';

interface QRCodeVerifyFormProps {
  totpURI: string;
  backupCodes: string[];
  onDone: () => void;
}

export default function QRCodeVerifyForm(props: QRCodeVerifyFormProps) {
  const { totpURI, backupCodes, onDone } = props;

  const [isPending, startTransition] = useTransition();
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const router = useRouter();
  const form = useForm<QrCodeVerifyFormValues>({
    resolver: zodResolver(qrCodeVerifyFormSchema),
    defaultValues: { token: '' },
  });

  const { isSubmitting } = form.formState;

  function handleQrCode(data: QrCodeVerifyFormValues) {
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
