'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useSearchParams } from 'next/navigation';
import { LazyResetPasswordForm } from '.';

export function ResetPasswordCard({ token }: { token: string }) {
  const searchParams = useSearchParams();

  return (
    <Card className='w-full max-w-sm mx-auto gap-4 py-4'>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            Enter your old password and a new password to update your account.
          </p>
          {searchParams.get('error') && (
            <p className={'text-xs text-red-600'}>
              Error: ${searchParams.get('error')}
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LazyResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
