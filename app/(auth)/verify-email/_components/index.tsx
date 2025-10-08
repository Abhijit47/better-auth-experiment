'use client';

import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

export const LazyVerifyEmailCard = dynamic(
  () => import('./verify-email-card'),
  {
    ssr: false,
    loading: () => (
      <div className='w-full max-w-lg mx-auto gap-4 py-4'>
        <div className={'space-y-4 px-6'}>
          <Skeleton className='h-3 w-3/4 animate-pulse' />
          <Skeleton className='h-3 w-3/4 animate-pulse' />
          <Skeleton className='h-3 w-32 animate-pulse' />
          <Skeleton className='h-8 w-full animate-pulse' />
          <Skeleton className='h-2 w-full animate-pulse' />
          <Skeleton className='h-2 w-32 animate-pulse' />
          <Skeleton className='h-8 w-full animate-pulse' />
          <Skeleton className='h-8 w-full animate-pulse' />
        </div>
      </div>
    ),
  }
);
