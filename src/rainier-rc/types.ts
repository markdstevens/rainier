import { RainierLogger } from 'rainier-logger/types';

interface RainierServerConfigEnv {
  httpPort: number;
  httpsPort: number;
  certFilePath: string;
  keyFilePath: string;
}

interface RainierServerConfig {
  dev: RainierServerConfigEnv;
  prod: RainierServerConfigEnv;
}

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
  server?: RainierServerConfig;
}

export type {
  ControllerConfig,
  StoreConfig,
  RainierHooks,
  RainierRC,
  RainierServerConfigEnv,
  RainierServerConfig,
};
