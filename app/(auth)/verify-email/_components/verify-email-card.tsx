'use client';
import { BetterFetchError } from 'better-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

export default function VerifyEmailCard({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const interval = useRef<NodeJS.Timeout>(undefined);
  const router = useRouter();

  useEffect(() => {
    startEmailVerificationCountdown();
  }, []);

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  function handleVerifyResendEmail() {
    setIsLoading(true);

    const decodedEmail = decodeURIComponent(email);
    startEmailVerificationCountdown();
    toast.promise(
      authClient.sendVerificationEmail({
        email: decodedEmail,
        callbackURL: '/sign-up-complete',
        fetchOptions: {
          onError(ctx) {
            const error = ctx.error as BetterFetchError & { code: string };

            if (
              error.code ===
              'YOU_CAN_ONLY_SEND_A_VERIFICATION_EMAIL_TO_AN_UNVERIFIED_EMAIL'
            ) {
              router.push('/sign-in');
              throw new Error(
                error.message ||
                  'You can only send a verification email to an unverified email'
              );
            }
            throw new Error(
              ctx.error.message ||
                'There was an error resending the verification email. Please try again.'
            );
          },
        },
      }),
      {
        description: 'Resending verification email',
        descriptionClassName: 'text-[10px]',
        loading: 'Resending verification email...',
        success: () => {
          return 'Verification email resent successfully';
        },
        error: (err: Error) =>
          (err as Error)?.message ||
          'There was an error resending the verification email. Please try again.',
        finally: () => setIsLoading(false),
      }
    );

    // startTransition(async () => {
    //   startEmailVerificationCountdown();
    //   await authClient.sendVerificationEmail({
    //     email: decodedEmail,
    //     callbackURL: '/sign-up-complete',
    //     fetchOptions: {
    //       // eslint-disable-next-line
    //       onRequest(context) {
    //         toast.loading('Resending verification email...', {
    //           id: 'resend-verification-email',
    //         });
    //       },
    //       onError(ctx) {
    //         const error = ctx.error as BetterFetchError & { code: string };
    //         if (
    //           error.code ===
    //           'YOU_CAN_ONLY_SEND_A_VERIFICATION_EMAIL_TO_AN_UNVERIFIED_EMAIL'
    //         ) {
    //           toast.error(
    //             'You can only send a verification email to an unverified email',
    //             { id: 'resend-verification-email' }
    //           );
    //           router.push('/sign-in');
    //           return;
    //         }

    //         toast.error(
    //           error.message ||
    //             'There was an error resending the verification email. Please try again.'
    //         );
    //         return;
    //       },
    //       onSuccess() {
    //         toast.success('Verification email resent successfully');
    //         return;
    //       },
    //     },
    //   });
    // });
  }

  return (
    <Card className='w-full max-w-lg mx-auto gap-4 py-4'>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Verify your email address</FieldLegend>
            <FieldDescription>
              <strong className={'underline underline-offset-2'}>
                {email}
              </strong>
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='email'>Email Address</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  disabled={isLoading}
                  className='mt-2'
                  defaultValue={email}
                  readOnly
                />
                <FieldDescription>
                  If you did not receive the email, click the button below to
                  resend verification email.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator className={''} />

          <Field orientation='vertical'>
            <Link
              href='/'
              className={cn(
                buttonVariants({
                  className: 'w-full',
                  variant: 'outline',
                })
              )}>
              Cancel
            </Link>
            <Button
              className={'w-full'}
              variant={timeToNextResend > 0 ? 'outline' : 'default'}
              disabled={timeToNextResend > 0 || isLoading}
              onClick={handleVerifyResendEmail}>
              {timeToNextResend > 0
                ? `Resend Email (${timeToNextResend})`
                : 'Resend Email'}
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
