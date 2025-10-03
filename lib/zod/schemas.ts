import { z } from 'zod';

export const signUpformSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.email(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
      });
    }
  });

export const signInFormSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
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

export type SignUpFormValues = z.infer<typeof signUpformSchema>;
export type SignInFormValues = z.infer<typeof signInFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
