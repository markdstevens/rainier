import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { wrapStoresWithRetriever } from 'rainier-store/wrap-stores-with-retriever';
import type { StoreProvidersProps } from './types';
import type { Stores, StoresWithRetriever } from 'rainier-store/types';

export const StoresContext = React.createContext({} as StoresWithRetriever);

export const StoreProviders: React.FC<StoreProvidersProps> = ({
  children,
  stores,
}: StoreProvidersProps) => {
  const reactiveStores = {} as Stores;

  for (const [storeName, store] of Object.entries(stores)) {
    // eslint-disable-next-line
    reactiveStores[storeName] = useLocalStore(() => store);
  }

  return (
    <StoresContext.Provider value={wrapStoresWithRetriever(reactiveStores)}>
      {children}
    </StoresContext.Provider>
  );
};
