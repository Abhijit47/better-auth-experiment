'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import dynamic from 'next/dynamic';

export const LazyProfileUpdateForm = dynamic(
  () => import('./profile-update-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'space-y-4'}>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-20 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-24 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-28 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-32 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <Skeleton className={'h-8 w-full animate-pulse'} />
      </div>
    ),
  }
);

export const LazyChangePasswordForm = dynamic(
  () => import('./change-password-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'p-6 space-y-4 border rounded-lg'}>
        <div className={'space-y-2'}>
          <Skeleton className={'h-4 w-32 animate-pulse'} />
          <Skeleton className={'h-3 w-60 animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-32 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-32 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-32 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'flex items-center gap-2'}>
          <Skeleton className={'size-4 animate-pulse'} />
          <Skeleton className={'h-4 w-64 animate-pulse'} />
        </div>
        <Skeleton className={'h-9 w-full animate-pulse'} />
      </div>
    ),
  }
);

export const LazySetPasswordResetButton = dynamic(
  () => import('./set-password-reset-button'),
  {
    ssr: false,
    loading: () => (
      <div className={'p-6 space-y-4 border rounded-lg'}>
        <div className={'space-y-2'}>
          <Skeleton className={'h-4 w-32 animate-pulse'} />
          <Skeleton className={'h-3 w-96 animate-pulse'} />
        </div>
        <Skeleton className={'h-9 w-full animate-pulse'} />
      </div>
    ),
  }
);

export const LazyTwoFactorAuthForm = dynamic(
  () => import('./two-factor-auth-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'p-6 space-y-4 border rounded-lg'}>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-28 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <Skeleton className={'h-9 w-full animate-pulse'} />
      </div>
    ),
  }
);

export const LazyQRCodeVerifyForm = dynamic(
  () => import('./qr-code-verify-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'flex items-center justify-center'}>
        <Spinner />
      </div>
    ),
  }
);

export const LazyUserAccountDeletion = dynamic(
  () => import('./user-account-deletion'),
  {
    ssr: false,
    loading: () => (
      <div>
        <Skeleton className={'h-9 w-full animate-pulse'} />
      </div>
    ),
  }
);
