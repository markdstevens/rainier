import { StoreMap } from '../rainier-store/types';

export {};

declare global {
  const __DEV__: boolean;

  interface Window {
    __INITIAL_STATE__: { stores: StoreMap };
  }
}
