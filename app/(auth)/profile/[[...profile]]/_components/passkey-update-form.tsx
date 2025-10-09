'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardEdit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth/client';
import {
  passkeyUpdateFormSchema,
  PasskeyUpdateFormValues,
} from '@/lib/zod/schemas';

export default function PasskeyUpdateForm({
  name,
  id,
}: PasskeyUpdateFormValues) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<PasskeyUpdateFormValues>({
    resolver: zodResolver(passkeyUpdateFormSchema),
    defaultValues: { name, id },
  });
  const { isSubmitting } = form.formState;

  function handleUpdatePasskey() {
    setIsLoading(true);
    toast.promise(
      authClient.passkey.updatePasskey({
        name: form.getValues('name'),
        id: form.getValues('id'),
        fetchOptions: {
          onError: (ctx) => {
            throw new Error(ctx.error.message || 'Failed to update passkey');
          },
        },
      }),
      {
        description: 'Update the name of this passkey for easy identification.',
        descriptionClassName: 'text-[10px]',
        loading: 'Updating passkey...',
        success: () => {
          router.refresh();
          setIsDialogOpen(false);
          return 'Passkey updated';
        },
        error: (e: Error) => e.message || 'Failed to updated passkey',
        finally: () => setIsLoading(false),
      }
    );
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(o) => {
        if (o) form.reset();
        setIsDialogOpen(o);
      }}>
      <DialogTrigger asChild>
        <Button disabled={isLoading} variant='outline' size='icon-sm'>
          <ClipboardEdit className={'size-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Passkey</DialogTitle>
          <DialogDescription>
            Update the name of this passkey for easy identification.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit(handleUpdatePasskey)}>
            <FormField
              disabled={isSubmitting || isLoading}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isSubmitting || isLoading}
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passkey Id</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              disabled={isSubmitting || isLoading}
              className='w-full'>
              {isSubmitting || isLoading ? (
                <span className='inline-flex items-center justify-center gap-2'>
                  Updating... <Spinner />
                </span>
              ) : (
                <span className='inline-flex items-center justify-center gap-2'>
                  Updating Passkey <ClipboardEdit className={'size-4'} />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
