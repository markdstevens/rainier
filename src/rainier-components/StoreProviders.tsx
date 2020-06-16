import React, { useReducer, useEffect } from 'react';
import { debounce } from 'rainier-util/debounce';
import { AllStoreContext } from 'rainier-store/all-store-context';
import type { StoreData, StoreProvidersProps } from './types';

export const StoreProviders: React.FC<StoreProvidersProps> = ({
  children,
  stores,
}: StoreProvidersProps) => {
  const storeData: StoreData[] = [];

  for (const store of Object.values(stores.stores)) {
    storeData.push({
      // eslint-disable-next-line
      reducer: useReducer(store.updateState, store),
      Provider: store.context.Provider,
      store,
    });
  }

  useEffect(() => {
    storeData.forEach(({ store, reducer }) => {
      store.dispatch = debounce(reducer[1], 10);
    });
  }, []);

  const tree = storeData
    .reverse()
    .reduce(
      (ChildrenTree, { Provider, reducer }) => <Provider value={reducer}>{ChildrenTree}</Provider>,
      children
    );

  return <AllStoreContext.Provider value={stores}>{tree}</AllStoreContext.Provider>;
};
