'use client';

import { Trash2Icon, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
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
import { authClient } from '@/lib/auth/client';

export default function UserAccountDeletion() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const token = authClient.useSession().data?.session.token;
  const currenWindowClose = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  function handleDeleteAccount() {
    setIsLoading(true);
    toast.promise(
      authClient.deleteUser({
        // token: token,
        callbackURL: '/',
        fetchOptions: {
          onError: (error) => {
            console.error('Error deleting account:', error);
            throw new Error(error.error.message);
          },
        },
      }),
      {
        description: 'This will permanently delete your account.',
        descriptionClassName: 'text-[10px]',
        loading: 'Deleting account...',
        success: () => {
          setIsOpen(false);
          currenWindowClose();
          return 'Account deleted successfully';
        },
        error: (error: Error) => error.message || 'Failed to delete account',
        finally() {
          setIsLoading(false);
        },
      }
    );
    return;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' className={'w-full'} disabled={isLoading}>
          Delete account <Trash2Icon className={'size-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete ?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className='flex items-center justify-center py-4'>
          <div className={'bg-destructive/10 p-4 rounded-full'}>
            <TriangleAlert className={'size-8 lg:size-12 stroke-destructive'} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            disabled={isLoading}
            onClick={handleDeleteAccount}>
            {isLoading ? (
              <span className='flex items-center gap-2'>
                Deleting... <Spinner />
              </span>
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
