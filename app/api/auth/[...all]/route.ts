import { auth } from '@/lib/auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest } from 'next/server';

const authHandlers = toNextJsHandler(auth);
// export const { GET } = toNextJsHandler(auth.handler);
export const { GET } = authHandlers;

export async function POST(request: NextRequest) {
  const clonedRequest = request.clone();

  return authHandlers.POST(clonedRequest);
}
