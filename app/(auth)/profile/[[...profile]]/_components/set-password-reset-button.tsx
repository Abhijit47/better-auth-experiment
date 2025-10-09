'use client';

import { Mails } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client';

export default function SetPasswordResetButton({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handlePasswordRequest() {
    setIsLoading(true);
    toast.promise(
      authClient.requestPasswordReset({
        email,
        redirectTo: '/reset-password',
        fetchOptions: {
          onError: (error) => {
            throw new Error(
              error.error.message || 'Failed to send reset email'
            );
          },
        },
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
        error: (err: Error) => err?.message || 'Failed to send reset email',
        finally: () => setIsLoading(false),
      }
    );
  }

  return (
    <Button
      className={'w-full'}
      variant='outline'
      disabled={isLoading}
      onClick={handlePasswordRequest}>
      {isLoading ? (
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
