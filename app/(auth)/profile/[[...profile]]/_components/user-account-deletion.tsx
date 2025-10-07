'use client';

import { TriangleAlert } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client/auth-client';

export default function UserAccountDeletion() {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const token = authClient.useSession().data?.session.token;

  function handleDeleteAccount() {
    startDeleteTransition(async () => {
      toast.promise(
        authClient.deleteUser({
          token: token,
          callbackURL: '/',
          fetchOptions: {
            onError: (error) => {
              console.error('Error deleting account:', error);
              throw new Error('Failed to delete account. Please try again.');
            },
            onSuccess: () => {
              // console.log('Account deleted successfully');
              setIsOpen(false);
              return;
            },
          },
        }),
        {
          loading: 'Deleting account...',
          success: 'Account deleted successfully',
          error: 'Failed to delete account. Please try again.',
        }
      );

      // await authClient.deleteUser({
      //   token: token,
      //   callbackURL: '/',
      //   fetchOptions: {
      //     onError: (error) => {
      //       console.error('Error deleting account:', error);
      //       toast.error('Failed to delete account. Please try again.');
      //       setIsOpen(false);
      //     },
      //     onSuccess: () => {
      //       // console.log('Account deleted successfully');
      //       toast.success('Account deleted successfully');
      //       setIsOpen(false);
      //     },
      //   },
      // });
      return;
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant='destructive' className={'w-full'}>
            Delete account
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete ?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className='flex items-center justify-center py-4'>
            <div className={'bg-destructive/10 p-4 rounded-full'}>
              <TriangleAlert
                className={'size-8 lg:size-12 stroke-destructive'}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' disabled={isDeletePending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant='destructive'
              disabled={isDeletePending}
              onClick={handleDeleteAccount}>
              {isDeletePending ? (
                <span className='flex items-center gap-2'>
                  Deleting... <Spinner />
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
