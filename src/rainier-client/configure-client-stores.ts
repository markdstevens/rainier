import { Stores, StoreMap, StoreConstructorFunction } from '../rainier-store/types';
import { initPlatformClientStores } from './init-platform-stores';

const { default: initCustomClientStores } = require(`${__STORES_DIR__}/init/client-stores`);

export function configureClientStores(serializedStores: { stores: StoreMap }): Stores {
  const stores = {
    ...initCustomClientStores(serializedStores.stores),
    ...initPlatformClientStores(serializedStores.stores),
  };

  return Object.assign(
    {},
    {
      stores,
      get: function <T extends StoreConstructorFunction>(storeClass: T): InstanceType<T> | never {
        const store = Object.values(stores).find((store) => store instanceof storeClass);

        if (!store) {
          throw new Error(`No store named "${storeClass.name}" was found`);
        }

        return store as InstanceType<T>;
      },
    }
  );
}
