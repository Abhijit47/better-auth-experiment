'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/auth-client';
import { Mails } from 'lucide-react';
import { useTransition } from 'react';

export default function SetPasswordResetButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();

  function handlePasswordRequest() {
    startTransition(() => {
      toast.promise(
        authClient.requestPasswordReset({
          email,
          redirectTo: '/reset-password',
        }),
        {
          description: 'Check your email for the password reset link.',
          descriptionClassName: 'text-[10px]',
          loading: 'Sending password reset email...',
          // eslint-disable-next-line
          success: (data) => {
            return (
              <span>
                Password reset email sent to <strong>{email}</strong>
              </span>
            );
          },
          error: 'Failed to send password reset email.',
        }
      );
    });
  }

  return (
    <Button
      className={'w-full'}
      variant='outline'
      disabled={isPending}
      onClick={handlePasswordRequest}>
      {isPending ? (
        <span className={'inline-flex items-center gap-2 animate-pulse'}>
          Sending... <Spinner />
        </span>
      ) : (
        <span className={'inline-flex items-center gap-2'}>
          Send Password Reset Email
          <Mails className='size-4' />
        </span>
      )}
    </Button>
  );
}
