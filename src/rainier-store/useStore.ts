import { useContext } from 'react';
import { AllStoreContext } from './all-store-context';
import { StoreConstructorFunction } from './internal-types';

/**
 * A hook that returns a reactive, application-state store. This
 * hook should be used to retrieve a store from a react function
 * component.
 *
 * @param storeClass The store class. It must implement IStore.
 *
 * @returns instance of the store of type T
 */
export const useStore = function <T extends StoreConstructorFunction>(
  storeClass: T
): InstanceType<T> {
  const allStores = useContext(AllStoreContext);
  const store = allStores.get<T>(storeClass);

  return useContext(store.context)[0];
};
