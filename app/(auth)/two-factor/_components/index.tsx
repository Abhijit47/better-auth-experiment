'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

export const LazyTotpForm = dynamic(() => import('./totp-form'), {
  ssr: false,
  loading: () => (
    <div className={'space-y-3'}>
      <div className={'space-y-2'}>
        <Skeleton className='h-3 w-3/12 animate-pulse' />
        <Skeleton className='h-8 w-full animate-pulse' />
      </div>
      <div className={'inline-flex items-center gap-2'}>
        <Skeleton className='h-4 w-4 animate-pulse' />
        <Skeleton className='h-3 w-48 animate-pulse' />
      </div>
      <Skeleton className='h-9 w-full animate-pulse' />
    </div>
  ),
});

export const LazyBackupCodeForm = dynamic(() => import('./backup-code-form'), {
  ssr: false,
  loading: () => (
    <div className={'space-y-3'}>
      <div className={'space-y-2'}>
        <Skeleton className='h-3 w-3/12 animate-pulse' />
        <Skeleton className='h-8 w-full animate-pulse' />
      </div>
      <div className={'inline-flex items-center gap-2'}>
        <Skeleton className='h-4 w-4 animate-pulse' />
        <Skeleton className='h-3 w-48 animate-pulse' />
      </div>
      <Skeleton className='h-9 w-full animate-pulse' />
    </div>
  ),
});
