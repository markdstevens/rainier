import type { StoreMap, Stores } from './types';
import type { StoreConstructorFunction } from './internal-types';

export function wrapStoresWithGetter(stores: StoreMap): Stores {
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
