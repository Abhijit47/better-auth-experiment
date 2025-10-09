'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface PasskeyDeleteButtonProps {
  passkeyId: string;
}

export default function PasskeyDeleteButton(props: PasskeyDeleteButtonProps) {
  const { passkeyId } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  function handleDeletePasskey(passkeyId: string) {
    setIsLoading(true);
    toast.promise(
      authClient.passkey.deletePasskey({
        id: passkeyId,
        fetchOptions: {
          onError: (ctx) => {
            throw new Error(ctx.error.message || 'Failed to delete passkey');
          },
        },
      }),
      {
        description: 'Remove this passkey from your account.',
        descriptionClassName: 'text-[10px]',
        loading: 'Deleting passkey...',
        success: () => {
          router.refresh();
          return 'Passkey deleted';
        },
        error: (e: Error) => e.message || 'Failed to delete passkey',
        finally: () => setIsLoading(false),
      }
    );
  }

  return (
    <Button
      variant='destructive'
      size='icon-sm'
      onClick={() => handleDeletePasskey(passkeyId)}>
      {isLoading ? <Spinner /> : <Trash2 className={'size-4'} />}
    </Button>
  );
}
