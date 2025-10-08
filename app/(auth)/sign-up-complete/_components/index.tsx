'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

export const LazySignUpCompleteForm = dynamic(
  () => import('./sign-up-complete-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'space-y-4'}>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-20 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-36 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <div className={'space-y-2'}>
          <Skeleton className={'h-3 w-20 animate-pulse'} />
          <Skeleton className={'h-8 w-full animate-pulse'} />
        </div>
        <Skeleton className={'h-9 w-full animate-pulse'} />
      </div>
    ),
  }
);
