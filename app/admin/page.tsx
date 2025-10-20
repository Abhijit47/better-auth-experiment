import { Skeleton } from '@/components/ui/skeleton';
import { requirePermission } from '@/lib/auth/require-permission';

export default async function Page() {
  // await requireAuth();

  const permission = await requirePermission();
  console.log('permission', permission);

  return (
    <>
      <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
        <Skeleton className='bg-muted/50 aspect-video rounded-xl' />
        <Skeleton className='bg-muted/50 aspect-video rounded-xl' />
        <Skeleton className='bg-muted/50 aspect-video rounded-xl' />
      </div>
      <p>Permission {JSON.stringify(permission)}</p>
      <div className='bg-muted/50 animate-pulse min-h-[100vh] flex-1 rounded-xl md:min-h-min' />
    </>
  );
}
