import { PasswordResetEmailProps } from '@/lib/resend';
import {
  Body,
  Button,
  CodeBlock,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  xonokai,
} from '@react-email/components';
import tailwingConfigs from './configs';

export default function PasswordResetEmail(props: PasswordResetEmailProps) {
  const { user, url, token } = props;

  return (
    <Html>
      <Head />
      <Preview>Reset your password for Better Auth</Preview>
      <Tailwind config={tailwingConfigs}>
        <Body className='mx-auto h-full my-auto bg-background px-2 py-2 font-sans'>
          <Container className='mx-auto my-[40px] max-w-[465px] w-full rounded border border-[#eaeaea] border-dashed p-[20px]'>
            <Section className='p-0.5'>
              <Heading className='mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black'>
                Hello, <strong>{user.name}</strong>
                <br />
              </Heading>
              <Text className={'text-center text-xl'}>Reset Your Password</Text>
              <Hr className='mx-0 my-[26px] w-full border border-[#eaeaea] border-solid' />
              <Text className={'text-center'}>
                You requested to reset your password. Click the button below to
                reset it:
              </Text>
            </Section>

            <Hr className='mx-0 w-full border border-[#eaeaea] border-solid' />

            <Section>
              <Text className={'text-xs'}>
                If you didn&apos;t create an account, please ignore this email.
              </Text>
              <Text className={'text-xs'}>
                This link will expire in 24 hours.
              </Text>
              <Text className={'text-xs'}>
                Best regards,
                <br />
                Your App Team
              </Text>
            </Section>

            <Section className='p-0.5 w-full mx-auto text-center'>
              {/* <CodeInline className='my-2 break-all'>{url}</CodeInline> */}
              <CodeBlock
                code={token.slice(0, 16) + ' ' + '************************'}
                lineNumbers={false}
                theme={xonokai}
                language='shell'
                className={'w-fit text-center'}
              />
            </Section>

            <Section className='p-0.5 flex items-center justify-center'>
              <Button
                href={url}
                className='border-1 border-solid border-black bg-black text-white px-6 py-2 rounded-lg font-medium text-sm'>
                Verify
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

PasswordResetEmail.PreviewProps = {
  user: {
    name: 'alanturing',
    email: 'alan.turing@example.com',
  },
  url: `http://example.com/reset-password?token=${crypto.randomUUID()}`,
  token: crypto.randomUUID(),
} as PasswordResetEmailProps;
