import { ClientConfigs } from '@/types/better-auth-types';
import clientPlugins from './auth-client-plugins';

const authClientConfigs = {
  // baseURL: 'http://localhost:3000',
  // basePath: '/auth',
  plugins: clientPlugins,
  // disableDefaultFetchPlugins: false,
  // fetchOptions: {},
  // $InferAuth: {}
} satisfies ClientConfigs;

export default authClientConfigs;
