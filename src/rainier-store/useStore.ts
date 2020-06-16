import { useContext } from 'react';
import { AllStoreContext } from './all-store-context';
import type { StoreConstructorFunction } from './internal-types';
import type { PrivateStoreMembers } from './types';

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
): Omit<InstanceType<T>, PrivateStoreMembers> {
  const allStores = useContext(AllStoreContext);
  const store = allStores.get(storeClass) as Omit<InstanceType<T>, PrivateStoreMembers> & {
    context: React.Context<any>;
  };

  return useContext(store.context)[0];
};
