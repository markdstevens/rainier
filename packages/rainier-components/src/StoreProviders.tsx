import React, { FunctionComponent, useReducer, ReactNode } from 'react';
import {
  Stores,
  ServerContextStoreProvider,
  ServerContextStore,
  AllStoreContextProvider,
  LocalizationStoreProvider,
  LocalizationStore,
} from '@rainier/store';

interface StoresProps {
  stores: Stores;
  children: ReactNode;
}

export const StoreProviders: FunctionComponent<StoresProps> = ({
  children,
  stores,
}: StoresProps) => {
  const serverContextStore = stores.get<ServerContextStore>('serverContextStore');
  const localizationStore = stores.get<LocalizationStore>('localizationStore');

  const serverContextStoreReducer = useReducer(
    serverContextStore.updateState,
    serverContextStore.state
  );
  const localizationStoreReducer = useReducer(
    localizationStore.updateState,
    localizationStore.state
  );

  return (
    <AllStoreContextProvider value={stores}>
      <ServerContextStoreProvider value={serverContextStoreReducer}>
        <LocalizationStoreProvider value={localizationStoreReducer}>
          {children}
        </LocalizationStoreProvider>
      </ServerContextStoreProvider>
    </AllStoreContextProvider>
  );
};
