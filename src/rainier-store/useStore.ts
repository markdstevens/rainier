import { useContext } from 'react';
import { StoresContext } from 'rainier-components/StoreProviders';

/**
 * A hook that returns a reactive, application-state store. This
 * hook should be used to retrieve a store from a react function
 * component.
 *
 * @param storeName The store name - same as the store's key in init/client
 * and init/server.
 *
 * @returns instance of the store
 */
export const useStore = function <T>(storeName: string): T {
  return useContext(StoresContext).get<T>(storeName);
};
