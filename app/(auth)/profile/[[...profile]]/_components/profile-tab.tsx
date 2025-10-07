import { requireAuth } from '@/lib/auth/require-auth';
import { LazyProfileUpdateForm } from '.';

export default async function ProfileTab() {
  const { user } = await requireAuth();

  return <LazyProfileUpdateForm user={user} />;
}
