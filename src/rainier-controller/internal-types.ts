import { FC } from 'react';
import { LoadableComponent } from '@loadable/component';
import { FetchOptions, Params } from './types';

export interface RegisteredControllerViewRoute {
  paths: string[];
  fullPaths: string[];
  View: LoadableComponent<{}>;
  method?: ((fetchOptions: FetchOptions) => Promise<void>) | undefined;
  isDefault: boolean;
}

export interface RegisteredControllerApiRoute {
  paths: string[];
  fullPaths: string[];
  method: (fetchOptions: FetchOptions) => Promise<void>;
}

export type RegisteredControllerRoute =
  | RegisteredControllerViewRoute
  | RegisteredControllerApiRoute;

export interface ControllerMatchResponse {
  controller?: RegisteredController;
  method?: (fetchOptions: FetchOptions) => Promise<any>;
  params: Params;
  paths: string[];
  fullPaths: string[];
}

export interface RegisteredController {
  basePath: string;
  routes: RegisteredControllerRoute[];
  isDefault: boolean;
  isHome: boolean;
}

export interface ReactRouterControllerData {
  fullPath: string;
  View: LoadableComponent<{}> | FC | undefined;
}
