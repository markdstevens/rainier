import { wrapStoresWithGetter } from 'rainier-store/to-stores-obj';
import { initPlatformStores } from './init-platform-stores';
import type { Request } from 'express';
import type { Stores, StoreMap } from 'rainier-store/types';

const { default: initCustomServerStores } = require(__INIT_SERVER_STORES__);

export function configureServerStores(req: Request): Stores {
  const stores: StoreMap = {
    ...initCustomServerStores(),
    ...initPlatformStores(req),
  };

  return wrapStoresWithGetter(stores);
}
