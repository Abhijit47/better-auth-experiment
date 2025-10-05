'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/auth-client';
import { BetterFetchError } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailCard({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);
  const [isPending, startTransition] = useTransition();
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
    const decodedEmail = decodeURIComponent(email);
    startTransition(async () => {
      startEmailVerificationCountdown();
      await authClient.sendVerificationEmail({
        email: decodedEmail,
        callbackURL: '/',
        fetchOptions: {
          // eslint-disable-next-line
          onRequest(context) {
            toast.loading('Resending verification email...', {
              id: 'resend-verification-email',
            });
          },
          onError(ctx) {
            const error = ctx.error as BetterFetchError & { code: string };
            if (
              error.code ===
              'YOU_CAN_ONLY_SEND_A_VERIFICATION_EMAIL_TO_AN_UNVERIFIED_EMAIL'
            ) {
              toast.error(
                'You can only send a verification email to an unverified email',
                { id: 'resend-verification-email' }
              );
              router.push('/sign-in');
              return;
            }

            toast.error(
              error.message ||
                'There was an error resending the verification email. Please try again.'
            );
            return;
          },
          onSuccess() {
            toast.success('Verification email resent successfully');
            return;
          },
        },
      });
    });
  }

  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle>Verify your email address ({email})</CardTitle>
        <CardDescription>
          <p className='text-sm text-muted-foreground'>
            We sent you a verification link. Please check your email and click
            the link to verify your account.
          </p>
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <Label className='text-sm text-muted-foreground'>
          If you did not receive the email, click the button below to resend
          verification email.
        </Label>
        <Input value={email} disabled className='mt-2' />
      </CardContent>

      <Separator />

      <CardFooter>
        <CardAction className={'w-full'}>
          <Button
            className={'w-full'}
            variant={timeToNextResend > 0 ? 'outline' : 'default'}
            disabled={timeToNextResend > 0 || isPending}
            onClick={handleVerifyResendEmail}>
            {timeToNextResend > 0
              ? `Resend Email (${timeToNextResend})`
              : 'Resend Email'}
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
