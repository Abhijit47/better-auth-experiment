import { getUserAccounts } from '@/lib/auth/get-user-accounts';
import { getUserPasskeys } from '@/lib/auth/get-user-passkeys';
import { requireAuth } from '@/lib/auth/require-auth';

export default async function SecurityTab() {
  const [{ user }, passkeys, accounts] = await Promise.all([
    requireAuth(),
    getUserPasskeys(),
    getUserAccounts(),
  ]);

  const UserSecurityForms = (await import('./user-security-forms')).default;

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
      passkeys={passkeys}
    />
  );
}
