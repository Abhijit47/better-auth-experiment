'use client';

import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client';

export default function RevokeOtherSessionsButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  function revokeOtherSessions() {
    setIsLoading(true);
    // startTransition(() => {
    toast.promise(authClient.revokeOtherSessions(undefined), {
      description:
        'This will revoke all other sessions except the current one.',
      descriptionClassName: 'text-[10px]',
      loading: 'Revoking other sessions...',
      // eslint-disable-next-line
      success: (data) => {
        router.refresh();
        return 'Other sessions revoked';
      },
      error: (err: Error) => `Error: ${err.message}`,
      finally: () => setIsLoading(false),
    });
    // });
  }

  return (
    <Button
      variant='destructive'
      disabled={isLoading}
      size='sm'
      onClick={revokeOtherSessions}>
      {isLoading ? (
        <span className='flex items-center gap-2'>
          Revoking... <Spinner />
        </span>
      ) : (
        <span className='flex items-center gap-2'>
          Revoke Other Sessions
          <ShieldAlert className='h-4 w-4' />
        </span>
      )}
    </Button>
  );
}
