export {};

declare global {
  const __DEV__: boolean;
  const __CONTROLLERS__: string;
  const __RAINIER_ROOT__: string;
  const __APP_ROOT__: string;
  const __APP_SHELL__: string;
  const __CSS_GLOBAL_FILE__: string;
  const __STORE_MANIFEST__: string;
  const __INIT_CLIENT_STORES__: string;
  const __INIT_SERVER_STORES__: string;
  const __SERVER_HOOKS__: string;
  const __CLIENT_HOOKS__: string;
  const __WEBPACK_OUTDIR__: string;
  const __RAINIER_CONTROLLER_MANIFEST__: any;

  interface Window {
    __INITIAL_STATE__: any;
    __CLIENT_CONFIG__?: any;
    __HTML_TAGS__: any;
    __WB_MANIFEST: Array<PrecacheEntry | string>;
    __RAINIER_CONTROLLER_MANIFEST__: string;
  }

  interface PrecacheEntry {
    integrity?: string;
    url: string;
    revision?: string;
  }
}
