import { format } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAuth } from '@/lib/auth/require-auth';

export default async function ProfileCardHeading() {
  const { user } = await requireAuth();

  return (
    <CardHeader className={'flex items-center justify-start gap-4'}>
      <div className={'size-12'}>
        <Image
          src={user.image ?? 'https://avatar.vercel.sh/rauchg?rounded=60'}
          alt={user.name ?? 'User Avatar'}
          width={100}
          height={100}
          className={'rounded-full w-full h-full object-cover'}
        />
      </div>
      <div className={'space-y-2'}>
        <CardTitle>
          {user.name} ({user.email})
        </CardTitle>
        <CardDescription>{user.email}</CardDescription>
        <CardDescription>
          <div className={'flex flex-wrap gap-2 text-sm text-muted-foreground'}>
            <span className={'flex items-center gap-2'}>
              Email Verified:{' '}
              {user.emailVerified ? (
                <CheckCircle2 className={'size-4 stroke-green-500'} />
              ) : (
                <XCircle className={'size-4 stroke-destructive'} />
              )}
            </span>
            <span className={'hidden md:block'}>| </span>

            <span className={'flex items-center gap-2'}>
              Updated At: {format(new Date(user.updatedAt), 'PPpp')}
            </span>
          </div>
        </CardDescription>
      </div>
    </CardHeader>
  );
}
