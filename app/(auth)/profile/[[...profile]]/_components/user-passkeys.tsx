import { type Passkey } from 'better-auth/plugins/passkey';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { IconPasswordFingerprint } from '@tabler/icons-react';
import { LazyPasskeyForm } from '.';
import UserPasskeyCard from './user-passkey-card';

export default function UserPasskeys({ passkeys }: { passkeys: Passkey[] }) {
  return (
    <div className='space-y-4'>
      {passkeys.length === 0 ? (
        <Empty className={'border'}>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <IconPasswordFingerprint className={'size-4'} />
            </EmptyMedia>
            <EmptyTitle>You have no passkeys yet.</EmptyTitle>
            <EmptyDescription>
              Add your first passkey for secure, passwordless authentication.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <LazyPasskeyForm />
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <UserPasskeyCard passkeys={passkeys} />
          <LazyPasskeyForm />
        </>
      )}
    </div>
  );
}
