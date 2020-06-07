export {};

declare global {
  const __DEV__: boolean;
  const __CONTROLLERS_DIR__: string;
  const __RAINIER_ROOT__: string;
  const __APP_ROOT__: string;
  const __APP_SHELL__: string;
  const __CSS_GLOBAL_FILE__: string;
  const __STORES_DIR__: string;

  interface Window {
    __INITIAL_STATE__: any;
  }
}
