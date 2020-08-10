import type { RainierLogger } from './types';

export const logger: RainierLogger = __CUSTOM_LOGGER__
  ? require(__CUSTOM_LOGGER__).default
  : require('./default-logger').default;
