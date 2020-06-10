import { RainierClientConfig, RainierServerConfig } from './lifecycle-hooks';

export function initServerHooks(): RainierServerConfig | undefined {
  return __SERVER_HOOKS__ && require(__SERVER_HOOKS__)?.default;
}

export function initClientHooks(): RainierClientConfig | undefined {
  return __CLIENT_HOOKS__ && require(__CLIENT_HOOKS__)?.default;
}
