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

export const profileUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  image: z.url(),
  favoriteNumber: z.string(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  confirmNewPassword: z.string().min(6),
  revokeOtherSessions: z.boolean(),
});

export const twoFactorAuthFormSchema = z.object({
  password: z.string().min(1),
});

export const qrCodeVerifyFormSchema = z.object({
  token: z.string().length(6),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type SignInWithEmailFormValues = z.infer<typeof signInWithEmailSchema>;
export type SignInWithUsernameFormValues = z.infer<
  typeof signInWithUsernameSchema
>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type TwoFactorAuthFormValues = z.infer<typeof twoFactorAuthFormSchema>;
export type QrCodeVerifyFormValues = z.infer<typeof qrCodeVerifyFormSchema>;
