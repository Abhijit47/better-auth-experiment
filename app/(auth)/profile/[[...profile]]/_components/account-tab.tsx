import { Card, CardContent } from '@/components/ui/card';
import { getUserAccounts } from '@/lib/auth/get-user-accounts';

export default async function AccountsTab() {
  const accounts = await getUserAccounts();

  const UserAccounts = (await import('./user-accounts')).default;

  const nonCredentialAccounts = accounts.filter(
    (a) => a.providerId !== 'credential'
  );

  return (
    <Card>
      <CardContent>
        <UserAccounts currentAccounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  );
}
