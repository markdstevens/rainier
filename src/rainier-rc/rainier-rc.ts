export interface ControllerConfig {
  manifest: string;
}

export interface StoreConfig {
  initClientStores: string;
  initServerStores: string;
}

export interface RainierHooks {
  server?: string;
  client?: string;
}

export interface RainierRC {
  publicAssetsDir?: string;
  controller: ControllerConfig;
  store?: StoreConfig;
  cssGlobalFile?: string;
  appShell?: string;
  rainierHooks?: RainierHooks;
}
