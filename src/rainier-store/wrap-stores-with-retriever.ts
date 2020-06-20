import type { Stores, StoresWithRetriever, Store } from './types';

export function wrapStoresWithRetriever(stores: Stores): StoresWithRetriever {
  return Object.assign(
    {},
    {
      stores,
      get: function <T extends Store>(storeName: string): T | never {
        const store = Object.entries(stores).find(([name]) => name === storeName)?.[1];

        if (!store) {
          throw new Error(`No store named "${storeName}" was found`);
        }

        return store as T;
      },
    }
  );
}
