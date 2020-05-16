import { FC } from 'react';
import { LoadableComponent } from '@loadable/component';
import { Stores } from '../rainier-store/types';
import { Controller } from './controller';

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

export interface RegisteredControllerAction {
  name: string;
  paths: string[];
  fullPaths: string[];
  view: LoadableComponent<{}> | undefined;
  method: ((fetchOptions: FetchOptions) => Promise<void>) | undefined;
  controller: RegisteredController;
}

export interface RegisteredController {
  instance: Controller | undefined;
  name: string;
  basePath: string;
  actions: RegisteredControllerAction[];
}

export interface ReactRouterAction {
  basePath: string;
  path: string;
  View: FC | LoadableComponent<{}> | undefined;
}
