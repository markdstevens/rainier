import { RainierLogger } from 'rainier-logger/types';

interface ControllerConfig {
  manifest: string;
}

interface StoreConfig {
  initClientStores: string;
  initServerStores: string;
}

interface RainierHooks {
  server?: string;
  client?: string;
}

interface RainierRC {
  publicAssetsDir?: string;
  controller: ControllerConfig;
  store?: StoreConfig;
  cssGlobalFile?: string;
  appShell?: string;
  rainierHooks?: RainierHooks;
  logger?: RainierLogger;
}

export type { ControllerConfig, StoreConfig, RainierHooks, RainierRC };
