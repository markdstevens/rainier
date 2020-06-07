import { useContext } from 'react';
import { AllStoreContext } from './all-store-context';
import { StoreConstructorFunction } from './types';

export const useStore = function <T extends StoreConstructorFunction>(
  storeClass: T
): InstanceType<T> {
  const allStores = useContext(AllStoreContext);
  const store = allStores.get<T>(storeClass);

  return useContext(store.context)[0];
};
