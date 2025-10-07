'use client';

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
import { authClient } from '@/lib/auth/client/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const backupCodeFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  trustDevice: z.boolean(),
});

type BackupCodeFormData = z.infer<typeof backupCodeFormSchema>;

export default function BackupCodeForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<BackupCodeFormData>({
    resolver: zodResolver(backupCodeFormSchema),
    defaultValues: {
      code: '',
      trustDevice: false,
    },
    mode: 'onChange',
  });

  const { isSubmitting } = form.formState;

  function handleBackupCodeVerification(data: BackupCodeFormData) {
    startTransition(async () => {
      toast.promise(
        authClient.twoFactor.verifyBackupCode({
          code: data.code,
          disableSession: false,
          trustDevice: data.trustDevice,
          fetchOptions: {
            onError(context) {
              throw new Error(
                context.error.message || 'Failed to verify backup code'
              );
            },
            onSuccess() {
              // router.refresh();
              router.push('/');
            },
          },
        }),
        {
          loading: 'Verifying backup code...',
          success: 'Backup code verified successfully!',
          error: (err: Error) => err.message || 'Failed to verify backup code',
        }
      );

      return;
    });
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(handleBackupCodeVerification)}>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backup Code</FormLabel>
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
          disabled={isPending || isSubmitting}
          className='w-full'>
          {isPending || isSubmitting ? (
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
