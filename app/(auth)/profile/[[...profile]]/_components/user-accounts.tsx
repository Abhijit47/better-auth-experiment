import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/constants/oauth-providers';
import { auth } from '@/lib/auth/auth';
import { IconBrandAuth0 } from '@tabler/icons-react';
import UserAccountCard from './user-account-card';

// Alternatively, you can import the auth instance and use the type from there
// import { type Account } from 'better-auth';

export type Account = Awaited<
  ReturnType<typeof auth.api.listUserAccounts>
>[number];

export default function UserAccounts(props: { currentAccounts: Account[] }) {
  const { currentAccounts } = props;

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Linked Accounts</h3>

        {currentAccounts.length === 0 ? (
          <Empty className={'border rounded-lg'}>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <IconBrandAuth0 className={'stroke-1'} />
              </EmptyMedia>
              <EmptyTitle>No linked accounts found</EmptyTitle>
              <EmptyDescription>
                You have not linked any external accounts yet.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription className={'flex items-center gap-2'}>
                Waiting for upcoming accounts <Spinner />
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <div className='space-y-3'>
            {currentAccounts.map((account) => (
              <UserAccountCard
                key={account.id}
                provider={account.providerId}
                account={account}
              />
            ))}
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Link Other Accounts</h3>
        <div className='grid gap-3'>
          {SUPPORTED_OAUTH_PROVIDERS.filter(
            (provider) =>
              !currentAccounts.find((acc) => acc.providerId === provider)
          ).map((provider) => (
            <UserAccountCard key={provider} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
}
