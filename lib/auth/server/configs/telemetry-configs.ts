import { type BetterAuthOptions } from 'better-auth';

const telemetryConfigs = {
  enabled: true,
  debug: false,
} satisfies BetterAuthOptions['telemetry'];

export default telemetryConfigs;
