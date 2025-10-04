'use server';

import WelcomeEmail, { WelcomeEmailProps } from '@/emails/welcome-mail';
import { render, toPlainText } from '@react-email/render';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const isDev = process.env.NODE_ENV === 'development';

export async function sendWelcomEmail(params: WelcomeEmailProps) {
  const html = await render(WelcomeEmail({ ...params }));
  const text = toPlainText(html);

  if (isDev) {
    // Create a transporter using MailHog's SMTP details
    const transporter = nodemailer.createTransport({
      host: 'localhost', // Or the IP address of your MailHog instance
      port: 1025,
      secure: false, // MailHog typically doesn't use TLS/SSL
    });
    try {
      const info = await transporter.sendMail({
        from: '"Better Auth Admin" <admin@better-auth.com>',
        to: params.email,
        subject: 'Welcome to Better Auth!',
        text: text,
        html: html,
      });
      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  } else {
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
}
