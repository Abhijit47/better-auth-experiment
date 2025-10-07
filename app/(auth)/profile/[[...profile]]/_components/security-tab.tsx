import { getUserAccounts } from '@/lib/auth/get-user-accounts';
import { requireAuth } from '@/lib/auth/require-auth';
import UserSecurityForms from './user-security-forms';

export default async function SecurityTab() {
  const [{ user }, accounts] = await Promise.all([
    requireAuth(),
    // auth.api.listPasskeys({ headers: await headers() }),
    getUserAccounts(),
  ]);

  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === 'credential'
  );

  const email = user.email;
  const isTwoFactorEnabled = user.twoFactorEnabled ?? false;

  return (
    <UserSecurityForms
      hasPasswordAccount={hasPasswordAccount}
      isTwoFactorEnabled={isTwoFactorEnabled}
      email={email}
    />
  );
}
