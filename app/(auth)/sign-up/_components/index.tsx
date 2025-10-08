'use client';

import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

export const LazySignUpForm = dynamic(() => import('./sign-up-form'), {
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
      <div className={'space-y-2'}>
        <div className={'flex items-center justify-between'}>
          <Skeleton className={'h-3 w-20 animate-pulse'} />
          <Skeleton className={'h-3 w-30 animate-pulse'} />
        </div>
        <Skeleton className={'h-8 w-full animate-pulse'} />
      </div>
      <div className={'space-y-2'}>
        <Skeleton className={'h-3 w-20 animate-pulse'} />
        <Skeleton className={'h-8 w-full animate-pulse'} />
      </div>
      <Skeleton className={'h-9 w-full animate-pulse'} />
    </div>
  ),
});
