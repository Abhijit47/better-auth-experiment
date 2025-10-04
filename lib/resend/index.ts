'use server';

import WelcomeEmail, { WelcomeEmailProps } from '@/emails/welcome-mail';
import { render, toPlainText } from '@react-email/render';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomEmail(params: WelcomeEmailProps) {
  const html = await render(WelcomeEmail({ ...params }));
  const text = toPlainText(html);

  const { data, error } = await resend.emails.send({
    from: 'Admin <onboarding@resend.dev>',
    to: params.email!,
    subject: 'Welcome to Better Auth!',
    react: WelcomeEmail({
      name: params.name,
      userImage: params.userImage,
      email: params.email,
    }),
    text: text,
  });

  if (error) {
    throw new Error(error.message);
  }
  console.log('welcome email sent', data);
}
