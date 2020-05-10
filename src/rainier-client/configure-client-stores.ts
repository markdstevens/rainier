import { Stores, StoreMap } from '../rainier-store/types';
import { initCustomClientStores } from './init-custom-client-stores';
import { initPlatformClientStores } from './init-platform-stores';

export function configureClientStores(serializedStores: { stores: StoreMap }): Stores {
  const stores = {
    ...initCustomClientStores(serializedStores.stores),
    ...initPlatformClientStores(serializedStores.stores),
  };

  return Object.assign(
    {},
    {
      stores,
      get: function <T>(storeName: string): T {
        return (this.stores[storeName] as unknown) as T;
      },
    }
  );
}
