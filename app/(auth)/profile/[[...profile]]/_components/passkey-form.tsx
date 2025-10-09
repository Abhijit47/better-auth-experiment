'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileKey } from 'lucide-react';
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
import { authClient } from '@/lib/auth/client/auth-client';
import { passkeyFormSchema, PasskeyFormValues } from '@/lib/zod/schemas';

export default function PasskeyForm() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<PasskeyFormValues>({
    resolver: zodResolver(passkeyFormSchema),
    defaultValues: {
      name: '',
    },
  });
  const { isSubmitting } = form.formState;

  function handleAddPasskey() {
    setIsLoading(true);
    toast.promise(
      authClient.passkey.addPasskey({
        name: form.getValues('name'),
        fetchOptions: {
          onError: (ctx) => {
            throw new Error(ctx.error.message || 'Failed to add passkey');
          },
        },
      }),
      {
        description:
          'Create a new passkey for secure, passwordless authentication.',
        descriptionClassName: 'text-[10px]',
        loading: 'Adding passkey...',
        success: () => {
          router.refresh();
          setIsDialogOpen(false);
          return 'Passkey added';
        },
        error: (e: Error) => e.message || 'Failed to add passkey',
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
        <Button className={'w-full'}>New Passkey</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Passkey</DialogTitle>
          <DialogDescription>
            Create a new passkey for secure, passwordless authentication.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit(handleAddPasskey)}>
            <FormField
              disabled={isSubmitting || isLoading}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  Adding... <Spinner />
                </span>
              ) : (
                <span className='inline-flex items-center justify-center gap-2'>
                  Add Passkey <FileKey className={'size-4'} />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
