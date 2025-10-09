import { type Passkey } from 'better-auth/plugins/passkey';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LazyChangePasswordForm,
  LazySetPasswordResetButton,
  LazyTwoFactorAuthForm,
} from '.';
import UserPasskeys from './user-passkeys';
// import UserPasskeys from './passkey-form';

interface UserSecurityFormsProps {
  hasPasswordAccount: boolean;
  isTwoFactorEnabled: boolean;
  email: string;
  passkeys: Passkey[];
}

export default function UserSecurityForms(props: UserSecurityFormsProps) {
  const { hasPasswordAccount, isTwoFactorEnabled, email, passkeys } = props;

  return (
    <div className='space-y-6'>
      {hasPasswordAccount ? (
        <Card className='py-4 gap-4'>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LazyChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card className='py-4 gap-4'>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will send you a password reset email to set up a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LazySetPasswordResetButton email={email} />
          </CardContent>
        </Card>
      )}

      {hasPasswordAccount && (
        <Card className='py-4 gap-4'>
          <CardHeader className='flex items-center justify-between gap-2'>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <Badge variant={isTwoFactorEnabled ? 'default' : 'secondary'}>
              {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </CardHeader>
          <CardContent>
            <LazyTwoFactorAuthForm isEnabled={isTwoFactorEnabled} />
          </CardContent>
        </Card>
      )}

      <Card className={'py-4 gap-4'}>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          <UserPasskeys passkeys={passkeys} />
        </CardContent>
      </Card>
    </div>
  );
}
