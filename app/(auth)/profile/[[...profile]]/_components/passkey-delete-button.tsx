'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client';
import { LazyPasskeyUpdateForm } from '.';

interface PasskeyDeleteButtonProps {
  passkeyId: string;
  name: string;
}

export default function PasskeyDeleteButton(props: PasskeyDeleteButtonProps) {
  const { passkeyId, name } = props;

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
    <ButtonGroup>
      <LazyPasskeyUpdateForm name={name} id={passkeyId} />
      <ButtonGroupSeparator decorative />
      <Button
        disabled={isLoading}
        variant='destructive'
        size='icon-sm'
        onClick={() => handleDeletePasskey(passkeyId)}>
        {isLoading ? <Spinner /> : <Trash2 className={'size-4'} />}
      </Button>
    </ButtonGroup>
  );
}
