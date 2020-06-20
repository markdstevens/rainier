import type { ControllerRegistry } from 'rainier-controller/registry/types';
import type { HtmlTagManager } from 'rainier-view/types';
import type { Stores } from 'rainier-store/types';

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

export type { AppProps, PageWrapperProps, StoreProvidersProps };
