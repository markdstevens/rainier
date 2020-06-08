import { initPlatformClientStores } from './init-platform-stores';
import { wrapStoresWithGetter } from 'rainier-store/to-stores-obj';
import { Stores, StoreMap } from 'rainier-store/types';

const { default: initCustomClientStores } = require(__INIT_CLIENT_STORES__);

export function configureClientStores(serializedStores: { stores: StoreMap }): Stores {
  const stores: StoreMap = {
    ...initCustomClientStores(serializedStores.stores),
    ...initPlatformClientStores(serializedStores.stores),
  };

  return wrapStoresWithGetter(stores);
}
