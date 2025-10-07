import { getUserSessions } from '@/lib/auth/get-user-sessions';
import { requireAuth } from '@/lib/auth/require-auth';
import UserSessions from './user-sessions';

export default async function SessionsTab() {
  const [{ session }, sessions] = await Promise.all([
    requireAuth(),
    getUserSessions(),
  ]);

  // const { session } = await requireAuth();
  const currentSessionToken = session.token;

  // const sessions = await auth.api.listSessions({
  //   headers: await headers(),
  // });

  return (
    <UserSessions
      sessions={sessions}
      currentSessionToken={currentSessionToken}
    />
  );
}
