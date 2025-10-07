'use client';

import { MinusCircle, PlusCircle, ShieldUser } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/auth-client';
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SupportedOAuthProvider,
} from '@/lib/auth/oAuth-providers';
import { Account } from './user-accounts';

interface UserAccountCardProps {
  provider: string;
  account?: Account;
}

export default function UserAccountCard(props: UserAccountCardProps) {
  const { provider, account } = props;
  const [isLinkingPending, startLinkingTransition] = useTransition();
  const [isUnlinkingPending, startUnlinkingTransition] = useTransition();
  const router = useRouter();

  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
    provider as SupportedOAuthProvider
  ] ?? {
    name: provider,
    Icon: ShieldUser,
  };

  function linkAccount() {
    startLinkingTransition(async () => {
      await authClient.linkSocial({
        provider,
        callbackURL: '/profile',
      });
      router.refresh();
      return;
    });

    // return authClient.linkSocial({
    //   provider,
    //   callbackURL: '/profile',
    // });
  }

  function unlinkAccount() {
    startUnlinkingTransition(async () => {
      if (account == null) {
        toast.promise(Promise.reject(new Error('Account not found')), {
          loading: 'Unlinking account...',
          success: 'Account unlinked',
          error: () => 'Error unlinking account',
        });
        return;
      }

      await authClient.unlinkAccount(
        {
          accountId: account.accountId,
          providerId: provider,
        },
        {
          onSuccess: () => {
            toast.success('Account unlinked');
            router.refresh();
            return;
          },
        }
      );
    });
  }

  return (
    <Card>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {<providerDetails.Icon className='size-5' />}
            <div>
              <p className='font-medium'>{providerDetails.name}</p>
              {account == null ? (
                <p className='text-sm text-muted-foreground'>
                  Connect your {providerDetails.name} account for easier sign-in
                </p>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {account == null ? (
            <Button
              variant='outline'
              size='sm'
              // action={linkAccount}
              disabled={isLinkingPending || isUnlinkingPending}
              onClick={() => linkAccount()}>
              {isLinkingPending ? (
                <span className={'inline-flex items-center gap-2'}>
                  Linking... <Spinner />
                </span>
              ) : (
                <span className={'inline-flex items-center gap-2'}>
                  Link <PlusCircle className={'size-4'} />
                </span>
              )}
            </Button>
          ) : (
            <Button
              variant='destructive'
              size='sm'
              // action={unlinkAccount}
              disabled={isUnlinkingPending || isLinkingPending}
              onClick={() => unlinkAccount()}>
              {isUnlinkingPending ? (
                <span className={'inline-flex items-center gap-2'}>
                  Unlinking... <Spinner />
                </span>
              ) : (
                <span className={'inline-flex items-center gap-2'}>
                  Unlink <MinusCircle className={'size-4'} />
                </span>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
