import { type BetterAuthOptions, type User } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';

import { sendWelcomEmail } from '@/lib/resend';

const hooksConfigs = {
  after: createAuthMiddleware(async (ctx) => {
    if (ctx.path.startsWith('/sign-up')) {
      const body = ctx.body as User;
      const url = 'https://avatar.vercel.sh/rauchg?rounded=60';
      const user = ctx.context.newSession?.user ?? {
        name: body.name,
        email: body.email,
        image: body.image,
      };

      if (user !== null) {
        await sendWelcomEmail({
          name: user.name,
          userImage: user.image ?? url,
          email: user.email,
        });
      }
    }
  }),
} satisfies BetterAuthOptions['hooks'];

export default hooksConfigs;
