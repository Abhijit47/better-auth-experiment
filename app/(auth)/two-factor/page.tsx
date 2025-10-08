import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { requireAuth } from '@/lib/auth/require-auth';
import { LazyBackupCodeForm, LazyTotpForm } from './_components';

export default async function TwoFactorAuthenticationPage() {
  await requireAuth();

  return (
    <Card className='w-full max-w-sm mx-auto gap-4 py-4'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='totp'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='totp'>Authenticator</TabsTrigger>
            <TabsTrigger value='backup'>Backup Code</TabsTrigger>
          </TabsList>

          <TabsContent value='totp' className={'mt-4'}>
            <LazyTotpForm />
          </TabsContent>

          <TabsContent value='backup' className={'mt-4'}>
            <LazyBackupCodeForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
