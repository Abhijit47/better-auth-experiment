'use client';

import { IconClock } from '@tabler/icons-react';
import { type Session } from 'better-auth';
import { Dot, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { UAParser } from 'ua-parser-js';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client/auth-client';
import UserSessionDeviceType from './user-session-device-type';

interface UserSessionCardProps {
  session: Session;
  isCurrentSession?: boolean;
}

export default function UserSessionCard(props: UserSessionCardProps) {
  const { session, isCurrentSession } = props;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (userAgentInfo == null) return 'Unknown Device';
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return 'Unknown Device';
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function getDeviceInformation() {
    if (userAgentInfo == null) return 'Unknown Device';
    if (
      userAgentInfo.device.vendor == null &&
      userAgentInfo.device.model == null
    ) {
      return 'Unknown Device';
    }

    if (userAgentInfo.device.vendor == null) return userAgentInfo.device.model;
    if (userAgentInfo.device.model == null) return userAgentInfo.device.vendor;

    return `${userAgentInfo.device.vendor} ${userAgentInfo.device.model}`;
  }

  function getEngineInformation() {
    if (userAgentInfo == null) return 'Unknown Engine';
    if (userAgentInfo.engine.name == null) return 'Unknown Engine';
    if (userAgentInfo.engine.version == null) return 'Unknown Version';

    return `${userAgentInfo.engine.name} ${userAgentInfo.engine.version}`;
  }

  function getCPUInformation() {
    if (userAgentInfo == null) return 'Unknown CPU';
    if (userAgentInfo.cpu.architecture == null) return 'Unknown CPU';
    return userAgentInfo.cpu.architecture;
  }

  function getOSInformation() {
    if (userAgentInfo == null) return 'Unknown OS';
    if (userAgentInfo.os.name == null) return 'Unknown OS';
    if (userAgentInfo.os.version == null) return 'Unknown Version';
    return `${userAgentInfo.os.name} ${userAgentInfo.os.version}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  function revokeSession() {
    startTransition(() => {
      toast.promise(
        authClient.revokeSession({
          token: session.token,
        }),
        {
          description: 'This will revoke the selected session.',
          descriptionClassName: 'text-[10px]',
          loading: 'Revoking session...',
          // eslint-disable-next-line
          success: (data) => {
            router.refresh();
            return 'Session revoked';
          },
          error: (err: Error) => `Error: ${err.message}`,
        }
      );
    });
  }

  return (
    <Card className={'py-4 gap-4'}>
      <CardHeader className='flex justify-between'>
        <CardTitle>
          <h3 className='text-sm'>{getBrowserInformation()}</h3>
        </CardTitle>
        {isCurrentSession && (
          <Badge>
            Current Session{' '}
            <Dot className={'text-green-500 size-8 animate-ping'} />
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <Item variant='outline' className={'text-xs'}>
          <ItemContent>
            <UserSessionDeviceType agentInfo={userAgentInfo} />
            <ItemTitle>
              <h4 className={'text-xs'}>Device - {getDeviceInformation()}</h4>
            </ItemTitle>
            <ItemTitle>
              <h4 className={'text-xs'}>Model - {getEngineInformation()}</h4>
            </ItemTitle>
            <ItemTitle>
              <h4 className={'text-xs'}>CPU - {getCPUInformation()}</h4>
            </ItemTitle>
            <ItemTitle>
              <h4 className={'text-xs'}>OS - {getOSInformation()}</h4>
            </ItemTitle>
            <ItemDescription
              className={'text-[11px] inline-flex items-center gap-1'}>
              <IconClock className={'size-4'} />
              Created: {formatDate(session.createdAt)}
            </ItemDescription>
            <ItemDescription
              className={'text-[11px] inline-flex items-center gap-1'}>
              <IconClock className={'size-4'} />
              Expires: {formatDate(session.expiresAt)}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            {!isCurrentSession && (
              <Button
                variant='destructive'
                size='icon'
                disabled={isPending}
                onClick={() => revokeSession()}>
                <span className={'sr-only'}>Session revoked</span>
                {isPending ? <Spinner /> : <Trash2 />}
              </Button>
            )}
          </ItemActions>
        </Item>
      </CardContent>
    </Card>
  );
}
