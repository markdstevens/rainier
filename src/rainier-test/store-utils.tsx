import React from 'react';
import { StoreProviders } from 'rainier-components/StoreProviders';
import type { FC } from 'react';
import type { StoreProviderBuilder } from './types';
import type { Store, StoresWithRetriever } from 'rainier-store/types';

export function setupStores(WrappedComponent: FC): StoreProviderBuilder {
  const stores = {} as StoresWithRetriever;
  const storeProviderBuilder: StoreProviderBuilder = {
    with<T>(initStore: () => Store, initialData: Partial<T> = {}) {
      const store = Object.assign({}, initStore(), initialData);

      stores[initStore.name] = store;

      return this;
    },

    provide() {
      const Providers = (): JSX.Element => (
        <StoreProviders stores={stores}>
          <WrappedComponent />
        </StoreProviders>
      );
      Providers.displayName = 'Providers';
      return Providers;
    },
  };

  return storeProviderBuilder;
}
