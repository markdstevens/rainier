import React from 'react';
import { StoreProviders } from 'rainier-components/StoreProviders';
import { wrapStoresWithGetter } from 'rainier-store/to-stores-obj';
import type { FC } from 'react';
import type { StoreConstructorFunction } from 'rainier-store/internal-types';
import type { StoreMap } from 'rainier-store/types';
import type { StoreProviderBuilder } from './types';

function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function setupStores(WrappedComponent: FC): StoreProviderBuilder {
  const stores: StoreMap = {};

  const storeProviderBuilder: StoreProviderBuilder = {
    with<T>(StoreConstructor: StoreConstructorFunction<T>, initialData: Partial<T>) {
      const store = new StoreConstructor(
        Object.assign({}, StoreConstructor.getDefaultState?.() ?? {}, initialData)
      );
      const storeName = uncapitalize(StoreConstructor.name);

      stores[storeName] = store;

      return this;
    },

    provide() {
      const Providers = (): JSX.Element => (
        <StoreProviders stores={wrapStoresWithGetter(stores)}>
          <WrappedComponent />
        </StoreProviders>
      );
      Providers.displayName = 'Providers';
      return Providers;
    },
  };

  return storeProviderBuilder;
}
