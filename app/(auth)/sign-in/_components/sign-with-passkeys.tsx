'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client';
import { LucideKeySquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SignWithPasskeysProps {
  isLoading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
}

export default function SignWithPasskeys(props: SignWithPasskeysProps) {
  const { isLoading, onLoading } = props;

  const router = useRouter();
  const { refetch } = authClient.useSession();

  useEffect(() => {
    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    void authClient.signIn.passkey({
      autoFill: true,
      fetchOptions: {
        onSuccess: () => {
          refetch();
          router.push('/');
        },
      },
    });
  }, [router, refetch]);

  function handleLoginWithPasskeys() {
    onLoading(true);
    toast.promise(
      authClient.signIn.passkey({
        // undefined,
        fetchOptions: {
          onError: (ctx) => {
            console.log({ ctx });
            throw new Error(
              ctx.error.message || 'Failed to login with passkey'
            );
          },
        },
      }),
      {
        description: 'Redirecting to homepage...',
        descriptionClassName: 'text-[10px]',
        loading: 'Please wait...',
        success: (res) => {
          if (res.error === null) {
            refetch();
            router.push('/');
            return 'Redirected to homepage';
          } else {
            throw new Error(
              res.error.message || 'Failed to redirect to homepage'
            );
          }
        },
        error: (e: Error) => e.message || 'Failed to redirect to homepage',
        finally() {
          onLoading(false);
        },
      }
    );
  }

  return (
    <CardContent>
      <Button
        className={'w-full'}
        variant={'secondary'}
        onClick={handleLoginWithPasskeys}
        disabled={isLoading}>
        {isLoading ? (
          <span className={'inline-flex items-center gap-2'}>
            Loading... <Spinner />
          </span>
        ) : (
          <span className={'inline-flex items-center gap-2'}>
            Sign in with Passkeys <LucideKeySquare className={'size-4'} />
          </span>
        )}
      </Button>
    </CardContent>
  );
}
