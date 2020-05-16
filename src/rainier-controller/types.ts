import { FC } from 'react';
import { LoadableComponent } from '@loadable/component';
import { Stores } from '../rainier-store/types';

export interface FetchOptions {
  params: Params;
  stores: Stores;
  actionPaths: string[] | string;
  fullPaths: string[];
  controllerPath: string;
  isServer: boolean;
}

interface Params {
  [key: string]: string | number | boolean;
}

export interface RegisteredControllerViewAction {
  paths: string[];
  fullPaths: string[];
  View: LoadableComponent<{}>;
  method?: ((fetchOptions: FetchOptions) => Promise<void>) | undefined;
}

export interface RegisteredControllerApiAction {
  paths: string[];
  fullPaths: string[];
  method: (fetchOptions: FetchOptions) => Promise<void>;
}

export type RegisteredControllerAction =
  | RegisteredControllerViewAction
  | RegisteredControllerApiAction;

export interface ControllerAndAction {
  controller?: RegisteredController;
  action?: RegisteredControllerAction;
}

export interface ControllerViewActionRoute {
  fullPath: string;
  View: FC | LoadableComponent<{}> | undefined;
}

export interface ControllerViewAction {
  paths: string[];
  View: LoadableComponent<{}>;
  method?: ((fetchOptions: FetchOptions) => Promise<any>) | undefined;
}

export interface ControllerApiAction {
  paths: string[];
  method: (fetchOptions: FetchOptions) => Promise<any>;
}

export type ControllerAction = ControllerViewAction | ControllerApiAction;

export interface Controller {
  basePath: string;
  actions: ControllerAction[];
}

export interface RegisteredController {
  basePath: string;
  actions: RegisteredControllerAction[];
}
