import { FC } from 'react';
import { LoadableComponent } from '@loadable/component';
import { Stores } from '../rainier-store/types';

export interface FetchOptions {
  params: Params;
  stores: Stores;
  routePaths: string[] | string;
  fullPaths: string[];
  controllerPath: string;
  isServer: boolean;
}

interface Params {
  [key: string]: string | number | boolean;
}

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

export interface ControllerViewRoute {
  paths?: string[];
  View: LoadableComponent<{}> | FC | undefined;
  method?: ((fetchOptions: FetchOptions) => Promise<any>) | undefined;
}

export interface ControllerApiRoute {
  paths: string[];
  method: (fetchOptions: FetchOptions) => Promise<any>;
}

export type ControllerRoute = ControllerViewRoute | ControllerApiRoute;

export interface Controller {
  basePath?: string;
  routes?: ControllerRoute[];
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
