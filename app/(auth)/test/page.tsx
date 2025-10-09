import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { requireAuth } from '@/lib/auth/require-auth';
import TwoFactorForm from './two-factor-form';

export default async function TestTwoFactor() {
  const [{ user }] = await Promise.all([requireAuth()]);

  const isTwoFactorEnabled = user.twoFactorEnabled ?? false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two Factor Authentication (2FA) Test Page</CardTitle>
        <CardDescription>
          <p className={'text-sm text-muted-foreground'}>
            This is a test page for enabling and disabling Two Factor
            Authentication (2FA) using TOTP.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TwoFactorForm isEnabled={isTwoFactorEnabled} />
      </CardContent>
    </Card>
  );
}
