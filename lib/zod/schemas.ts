import { z } from 'zod';

export const signUpFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.email(),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128),
  username: z.string().min(5).max(50),
  displayUsername: z.string().min(5).max(50).optional(),
});

export const signInWithEmailSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const signInWithUsernameSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  upassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const forgotPasswordFormSchema = z.object({
  email: z.email('Invalid email address'),
});

export const resetPasswordFormSchema = z.object({
  oldPassword: z
    .string()
    .min(8, 'Old Password must be at least 8 characters long'),
  newPassword: z
    .string()
    .min(8, 'New Password must be at least 8 characters long'),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type SignInWithEmailFormValues = z.infer<typeof signInWithEmailSchema>;
export type SignInWithUsernameFormValues = z.infer<
  typeof signInWithUsernameSchema
>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
