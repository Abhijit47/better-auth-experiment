'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

export const LazyResetPasswordForm = dynamic(
  () => import('./reset-password-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'space-y-4'}>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-20 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-20 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <Skeleton className={'h-0.5 w-full animate-pulse'} />
        <div className={'space-y-2'}>
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
      </div>
    ),
  }
);
