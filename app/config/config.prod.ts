/**
 * These are configuration settings for the production environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
import baseConfig from './config.base';

export default {
  ...baseConfig,
  APP_SCHEME: 'whereismyelf',
  API_URL: 'https://api.dev.whereismyelfie.click',
  ENABLE_DEBUG_MODE: false,
};