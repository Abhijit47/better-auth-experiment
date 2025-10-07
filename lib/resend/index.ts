'use server';

import { render, toPlainText } from '@react-email/render';
import { User } from 'better-auth';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

import PasswordResetEmail from '@/emails/password-reset-email';
import SignUpEmailVerification from '@/emails/verification-email';
import WelcomeEmail from '@/emails/welcome-mail';

const resend = new Resend(process.env.RESEND_API_KEY);

const isDev = process.env.NODE_ENV === 'development';

export interface WelcomeEmailProps {
  name: string;
  userImage: string;
  email: string;
}

export interface VerificationEmailProps {
  user: User;
  url: string;
  token: string;
}

export interface PasswordResetEmailProps {
  user: User;
  url: string;
  token: string;
}

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

export async function sendVerificationEmail(params: VerificationEmailProps) {
  const { user, url, token } = params;
  const html = await render(SignUpEmailVerification({ ...params }));
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
        to: params.user.email,
        subject: 'Verify your email address!',
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
      to: params.user.email,
      subject: 'Verify your email address!',
      react: SignUpEmailVerification({
        user: user,
        url: url,
        token: token,
      }),
      text: text,
    });

    if (error) {
      throw new Error(error.message);
    }
    console.log('Verification email sent', data);
  }
}

export async function sendPasswordResetEmail(params: PasswordResetEmailProps) {
  const { user, url, token } = params;
  const html = await render(PasswordResetEmail({ ...params }));
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
        to: params.user.email,
        subject: 'Reset your password',
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
      to: params.user.email,
      subject: 'Reset your password',
      react: PasswordResetEmail({
        user: user,
        url: url,
        token: token,
      }),
      text: text,
    });

    if (error) {
      throw new Error(error.message);
    }
    console.log('Password reset email sent', data);
  }
}
