'use client';

import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/auth-client';

export default function RevokeOtherSessionsButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function revokeOtherSessions() {
    startTransition(() => {
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
      });
    });
  }

  return (
    <Button
      variant='destructive'
      disabled={isPending}
      size='sm'
      onClick={revokeOtherSessions}>
      {isPending ? (
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
