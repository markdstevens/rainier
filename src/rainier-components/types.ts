import type { ControllerRegistry } from 'rainier-controller/registry/types';
import type { HtmlTagManager } from 'rainier-view/types';
import type { Stores, IStore } from 'rainier-store/types';

interface AppProps {
  stores: Stores;
  controllerRegistry: ControllerRegistry;
  htmlTagManager?: HtmlTagManager;
}

type PageWrapperProps = React.PropsWithChildren<{
  controllerRegistry: ControllerRegistry;
  htmlTagManager?: HtmlTagManager;
}>;

type StoreProvidersProps = React.PropsWithChildren<{
  stores: Stores;
}>;

interface StoreData {
  store: IStore;
  reducer: [any, React.Dispatch<any>];
  Provider: React.Provider<any>;
}

export type { AppProps, PageWrapperProps, StoreProvidersProps, StoreData };
