import { type BetterAuthOptions } from 'better-auth';

const socialProvidersConfigs = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    mapProfileToUser(profile) {
      return {
        favoriteNumber: Number(profile.public_repos) || 0,
      };
    },
    // redirectURI: "/profile",
  },
} satisfies BetterAuthOptions['socialProviders'];

export default socialProvidersConfigs;
