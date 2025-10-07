import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { requireAuth } from '@/lib/auth/require-auth';
import BackupCodeForm from './_components/backup-code-form';
import TotpForm from './_components/totp-form';

export default async function TwoFactorAuthenticationPage() {
  await requireAuth();

  return (
    <div className='my-6 px-4'>
      <Card className='w-full min-w-md mx-auto'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='totp'>
            <TabsList className='grid w-full grid-cols-2 mb-8'>
              <TabsTrigger value='totp'>Authenticator</TabsTrigger>
              <TabsTrigger value='backup'>Backup Code</TabsTrigger>
            </TabsList>

            <TabsContent value='totp'>
              <TotpForm />
            </TabsContent>

            <TabsContent value='backup'>
              <BackupCodeForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
