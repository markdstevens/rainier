import type { Stores } from 'rainier-store/types';
import { serverContextStore } from 'rainier-store/server-context-store';

const { default: initCustomClientStores } = require(__INIT_CLIENT_STORES__);

export function configureClientStores(serializedStores: Stores): Stores {
  const stores: Stores = {
    ...initCustomClientStores(),
    serverContextStore: serverContextStore(),
  };

  for (const storeName of Object.keys(stores)) {
    stores[storeName] = Object.assign({}, stores[storeName], serializedStores[storeName]);
  }

  return stores;
}
