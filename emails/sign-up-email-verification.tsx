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

export interface SignUpEmailVerificationProps {
  user: {
    name: string;
    email: string;
  };
  url: string;
  token: string;
}

export default function SignUpEmailVerification({
  user,
  url,
  token,
}: {
  user: {
    name: string;
    email: string;
  };
  url: string;
  token: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Please verify your email address</Preview>

      <Tailwind
        config={{
          corePlugins: {
            preflight: true,
          },
          theme: {
            extend: {
              colors: {
                background: 'oklch(0.9900 0 0)',
                foreground: 'oklch(0 0 0)',
                card: 'oklch(1 0 0)',
                'card-foreground': 'oklch(0 0 0)',
                popover: 'oklch(0.9900 0 0)',
                'popover-foreground': 'oklch(0 0 0)',
                primary: 'oklch(0 0 0)',
                'primary-foreground': 'oklch(1 0 0)',
                secondary: 'oklch(0.9400 0 0)',
                'secondary-foreground': 'oklch(0 0 0)',
                muted: 'oklch(0.9700 0 0)',
                'muted-foreground': 'oklch(0.4400 0 0)',
                accent: 'oklch(0.9400 0 0)',
                'accent-foreground': 'oklch(0 0 0)',
                destructive: 'oklch(0.6300 0.1900 23.0300)',
                'destructive-foreground': 'oklch(1 0 0)',
                border: 'oklch(0.9200 0 0)',
                input: 'oklch(0.9400 0 0)',
                ring: 'oklch(0 0 0)',
                'chart-1': 'oklch(0.8100 0.1700 75.3500)',
                'chart-2': 'oklch(0.5500 0.2200 264.5300)',
                'chart-3': 'oklch(0.7200 0 0)',
                'chart-4': 'oklch(0.9200 0 0)',
                'chart-5': 'oklch(0.5600 0 0)',
                sidebar: 'oklch(0.9900 0 0)',
                'sidebar-foreground': 'oklch(0 0 0)',
                'sidebar-primary': 'oklch(0 0 0)',
                'sidebar-primary-foreground': 'oklch(1 0 0)',
                'sidebar-accent': 'oklch(0.9400 0 0)',
                'sidebar-accent-foreground': 'oklch(0 0 0)',
                'sidebar-border': 'oklch(0.9400 0 0)',
                'sidebar-ring': 'oklch(0 0 0)',
              },
              fontFamily: {
                sans: 'Geist, sans-serif',
                serif: 'Georgia, serif',
                mono: 'Geist Mono, monospace',
              },
            },
          },
          darkMode: 'class',
        }}>
        <Body className='mx-auto h-full my-auto bg-background px-2 py-2 font-sans'>
          <Container className='mx-auto my-[40px] max-w-[465px] w-full rounded border border-[#eaeaea] border-dashed p-[20px]'>
            <Section className='p-0.5'>
              <Heading className='mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black'>
                Hello, <strong>{user.name}</strong>
                <br />
              </Heading>
              <Text className={'text-center text-xl'}>
                Verify your email address
              </Text>
              <Hr className='mx-0 my-[26px] w-full border border-[#eaeaea] border-solid' />
              <Text className={'text-center'}>
                Thank you for signing up! Please verify your email address by
                clicking the button below:
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

SignUpEmailVerification.PreviewProps = {
  user: {
    name: 'alanturing',
    email: 'alan.turing@example.com',
  },
  url: `http://example.com/verify-email?token=${crypto.randomUUID()}`,
  token: crypto.randomUUID(),
} as SignUpEmailVerificationProps;
