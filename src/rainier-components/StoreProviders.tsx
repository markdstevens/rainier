import React, { useReducer, useEffect } from 'react';
import { AllStoreContextProvider } from '../rainier-store/all-store-context';
import { debounce } from '../rainier-util';
import { Stores, IStore } from '../rainier-store';

type StoreProvidersProps = React.PropsWithChildren<{
  stores: Stores;
}>;

interface StoreData {
  store: IStore;
  reducer: [any, React.Dispatch<any>];
  Provider: React.Provider<any>;
}

export const StoreProviders: React.FC<StoreProvidersProps> = ({
  children,
  stores,
}: StoreProvidersProps) => {
  const storeData: StoreData[] = [];

  for (const store of Object.values(stores.stores)) {
    storeData.push({
      store,
      reducer: useReducer(store.updateState, store), // eslint-disable-line
      Provider: store.context.Provider,
    });
  }

  useEffect(() => {
    storeData.forEach(({ store, reducer }) => {
      store.dispatch = debounce(reducer[1], 10);
    });
  });

  const tree = storeData
    .reverse()
    .reduce(
      (ChildrenTree, { Provider, reducer }) => <Provider value={reducer}>{ChildrenTree}</Provider>,
      children
    );

  return <AllStoreContextProvider value={stores}>{tree}</AllStoreContextProvider>;
};
