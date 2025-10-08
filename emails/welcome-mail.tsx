import { WelcomeEmailProps } from '@/lib/resend';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwingConfigs from './configs';

export default function WelcomeEmail(props: WelcomeEmailProps) {
  const { name, userImage, email } = props;

  return (
    <Html>
      <Head />
      <Preview>Welcome to our service!</Preview>

      <Tailwind config={tailwingConfigs}>
        <Body className='mx-auto my-auto bg-background px-2 py-2 font-sans'>
          <Container className='mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-dashed p-[20px]'>
            <Section className='mt-[32px] p-0.5'>
              <Img
                src={userImage ?? 'https://avatar.vercel.sh/rauchg.svg'}
                width='40'
                height='40'
                alt={name}
                className='mx-auto my-0 rounded-full'
              />
            </Section>
            <Section className='mt-[32px] text-center'>
              <Heading className='mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black'>
                {name}, <br /> Welcome to Our App!
              </Heading>
              <Hr className='mx-0 my-[26px] w-full border border-[#eaeaea] border-solid' />
              <Text>Hello ${name},</Text>
              <Text>
                Thank you for signing up for our app! We&apos;re excited to have
                you on board.
              </Text>

              <Text>
                Best regards,
                <br />
                <strong>{email}</strong>
                <br />
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: 'alanturing',
  userImage: 'https://avatar.vercel.sh/rauchg.svg',
  email: 'alan.turing@example.com',
} as WelcomeEmailProps;
