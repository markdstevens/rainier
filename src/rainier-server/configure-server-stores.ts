import { Request } from 'express';
import { Stores, StoreMap } from 'rainier-store/types';
import { initPlatformStores } from './init-platform-stores';
import { wrapStoresWithGetter } from 'rainier-store/to-stores-obj';

const { default: initCustomServerStores } = require(__INIT_SERVER_STORES__);

export function configureServerStores(req: Request): Stores {
  const stores: StoreMap = {
    ...initCustomServerStores(),
    ...initPlatformStores(req),
  };

  return wrapStoresWithGetter(stores);
}
