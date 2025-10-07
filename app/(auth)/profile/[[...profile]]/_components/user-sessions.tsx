'use client';

import { Session } from 'better-auth';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { UserLock } from 'lucide-react';
import RevokeOtherSessionsButton from './revoke-other-sessions-button';
import UserSessionCard from './user-session-card';

interface UserSessionsProps {
  sessions: Session[];
  currentSessionToken: string;
}

export default function UserSessions(props: UserSessionsProps) {
  const { sessions, currentSessionToken } = props;

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  return (
    <div className='space-y-6'>
      {currentSession && (
        <UserSessionCard session={currentSession} isCurrentSession />
      )}

      <div className='space-y-4'>
        {otherSessions.length > 0 && (
          <div className='flex items-center justify-between'>
            <h3 className='text-md font-medium'>Other Active Sessions</h3>
            <RevokeOtherSessionsButton />
          </div>
        )}

        {otherSessions.length === 0 ? (
          <Empty className={'border rounded-lg'}>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <UserLock />
              </EmptyMedia>
              <EmptyTitle>No Other Active Sessions</EmptyTitle>
              <EmptyDescription>
                You have no other active sessions at the moment.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription className={'flex items-center gap-2'}>
                Waiting for upcoming sessions <Spinner />
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <div className='space-y-3'>
            {otherSessions.map((session) => (
              <UserSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
