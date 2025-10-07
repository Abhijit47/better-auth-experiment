import { auth } from '@/lib/auth/auth';
import { authClient } from '@/lib/auth/auth-client';

// import { InferUser,Models,User } from "better-auth/types";

export type Account = Awaited<
  ReturnType<typeof auth.api.listUserAccounts>
>[number];
export type UserWithAddlInfo = (typeof authClient.$Infer.Session)['user'];
