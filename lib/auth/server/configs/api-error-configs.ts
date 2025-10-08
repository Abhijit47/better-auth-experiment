import { type BetterAuthOptions } from 'better-auth';

const apiErrorConfigs = {
  throw: true,
  onError(error, ctx) {
    console.error('API Error:', { error, ctx });
    return Promise.reject(error);
  },
  errorURL: '/auth/my-error',
} satisfies BetterAuthOptions['onAPIError'];

export default apiErrorConfigs;
