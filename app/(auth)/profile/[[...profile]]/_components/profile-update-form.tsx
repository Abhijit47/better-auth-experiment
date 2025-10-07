'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/ui/button';
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
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

const profileUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  image: z.url(),
  favoriteNumber: z.string(),
});

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

type UserWithAddlInfo = (typeof authClient.$Infer.Session)['user'];

interface ProfileUpdateFormProps {
  user: UserWithAddlInfo;
}

export default function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const [isProfileUpdatePending, startProfileUpdateTransition] =
    useTransition();
  const router = useRouter();

  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image ?? 'https://avatar.vercel.sh/rauchg?rounded=60',
      favoriteNumber: String(user.favoriteNumber) ?? '0',
    },
  });

  const { isSubmitting } = form.formState;

  function handleProfileUpdate(values: ProfileUpdateFormData) {
    startProfileUpdateTransition(async () => {
      const promises = [
        authClient.updateUser({
          name: values.name,
          favoriteNumber: Number(values.favoriteNumber),
          image: values.image,
        }),
      ];

      if (values.email !== user.email) {
        promises.push(
          authClient.changeEmail({
            newEmail: values.email,
            callbackURL: '/profile',
          })
        );
      }

      toast.promise(Promise.all(promises), {
        description: 'Profile update in progress',
        loading: 'Updating profile...',
        success: (data) => {
          const updateUserResult = data[0];
          // const changeEmailResult = data[1] ?? { error: false };
          const changeEmailResult = data[1];
          if (updateUserResult.error) {
            router.refresh();
            throw new Error(
              updateUserResult.error.message || 'Failed to update profile.'
            );
          } else if (changeEmailResult.error) {
            router.refresh();
            throw new Error(
              changeEmailResult.error.message || 'Failed to change email.'
            );
          } else {
            if (values.email !== user.email) {
              router.refresh();
              return 'Please check your new email to verify it.';
            } else {
              router.refresh();
              return 'Profile updated successfully!';
            }
          }
        },
        error: (err: Error) => err.message || 'Failed to update profile.',
        duration: 5000,
      });

      // const res = await Promise.all(promises);
      // const updateUserResult = res[0];
      // const changeEmailResult = res[1] ?? { error: false };

      // console.log({ updateUserResult, changeEmailResult });

      // if (updateUserResult.error) {
      //   toast.error(
      //     updateUserResult.error.message || 'Failed to update profile.'
      //   );
      // } else if (changeEmailResult.error) {
      //   toast.error(
      //     changeEmailResult.error.message || 'Failed to change email.'
      //   );
      // } else {
      //   if (values.email !== user.email) {
      //     toast.success('Please check your new email to verify it.');
      //   } else {
      //     toast.success('Profile updated successfully!');
      //   }
      //   router.refresh();
      // }
    });
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(handleProfileUpdate)}>
        <FormField
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

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input type='url' {...field} disabled readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='favoriteNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isSubmitting || isProfileUpdatePending}
          className='w-full'>
          {isSubmitting || isProfileUpdatePending ? (
            <span className={'flex items-center gap-2'}>
              Updating...
              <Spinner />
            </span>
          ) : (
            'Update Profile'
          )}
        </Button>
      </form>
    </Form>
  );
}
