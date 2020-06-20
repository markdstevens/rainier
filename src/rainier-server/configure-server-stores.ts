import { initPlatformStores } from './init-platform-stores';
import type { Request } from 'express';
import type { Stores } from 'rainier-store/types';
import { toJSON } from 'rainier-util/to-json-safe';

const { default: initCustomServerStores } = require(__INIT_SERVER_STORES__);

export function configureServerStores(req: Request): Stores {
  const stores: Stores = {
    ...initCustomServerStores(),
    ...initPlatformStores(req),
  };

  Object.values(stores)
    .filter((store) => typeof store.toJSON === 'undefined')
    .forEach((store) => {
      store.toJSON = toJSON;
    });

  return stores;
}
