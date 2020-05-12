import { StoreMap } from '../rainier-store/types';

export {};

declare global {
  const __I18N_DIR__: string;
  const __DEV__: boolean;

  interface Window {
    __INITIAL_STATE__: { stores: StoreMap };
  }
}
