export {};

declare global {
  const __DEV__: boolean;
  const __CONTROLLERS_DIR__: string;
  const __RAINIER_ROOT__: string;
  const __APP_ROOT__: string;

  interface Window {
    __INITIAL_STATE__: any;
  }
}
