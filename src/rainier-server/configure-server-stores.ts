import { Request } from 'express';
import { Stores, StoreConstructorFunction } from '../rainier-store/types';
import { initPlatformStores } from './init-platform-stores';

const { default: initCustomServerStores } = require(`${__STORES_DIR__}/init/server-stores`);

export function configureServerStores(req: Request): Stores {
  const stores = {
    ...initCustomServerStores(),
    ...initPlatformStores(req),
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
