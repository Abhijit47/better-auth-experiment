import { type Passkey } from 'better-auth/plugins/passkey';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LazyPasskeyDeleteButton } from '.';

export default function UserPasskeyCard({ passkeys }: { passkeys: Passkey[] }) {
  return (
    <div className='space-y-4'>
      {passkeys.map((passkey) => (
        <Card key={passkey.id} className={'py-4 gap-4'}>
          <CardHeader className='flex gap-2 items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle>{passkey.name ?? 'N/A'}</CardTitle>
              <CardDescription>{passkey.deviceType}</CardDescription>
            </div>
            <CardAction>
              <LazyPasskeyDeleteButton
                passkeyId={passkey.id}
                name={passkey.name ?? 'N/A'}
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <p className={'text-sm text-muted-foreground'}>
                Created {new Date(passkey.createdAt).toLocaleDateString()}
              </p>
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
