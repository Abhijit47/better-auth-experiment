'use client';

import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

export const LazySignWithEmailForm = dynamic(
  () => import('./sign-with-email-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'space-y-4'}>
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
        <Skeleton className={'h-9 w-full animate-pulse'} />
      </div>
    ),
  }
);
export const LazySignWithUsernameForm = dynamic(
  () => import('./sign-with-username-form'),
  {
    ssr: false,
    loading: () => (
      <div className={'space-y-4'}>
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
        <Skeleton className={'h-9 w-full animate-pulse'} />
      </div>
    ),
  }
);
export const LazySignWithSocial = dynamic(() => import('./sign-with-social'), {
  ssr: false,
  loading: () => (
    <div className='px-6 grid grid-cols-2 gap-2 w-full'>
      <Skeleton className='h-8 w-full rounded-md animate-pulse' />
      <Skeleton className='h-8 w-full rounded-md animate-pulse' />
    </div>
  ),
});
