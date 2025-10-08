import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LazySignUpCompleteForm } from '.';

export default function SignUpCompleteCard() {
  return (
    <Card className='w-full max-w-sm mx-auto gap-4 py-4'>
      <CardHeader>
        <CardTitle>Complete your sign up</CardTitle>
        <CardDescription>
          <p className={'text-xs'}>
            Please provide a username to complete your account setup.
          </p>
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <LazySignUpCompleteForm />
      </CardContent>
    </Card>
  );
}
