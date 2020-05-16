import { FC } from 'react';
import { LoadableComponent } from '@loadable/component';
import { FetchOptions } from './types';

export interface ControllerAndAction {
  controller?: Controller;
  action?: ControllerAction;
}

export interface ControllerActionRoute {
  fullPath: string;
  View: FC | LoadableComponent<{}> | undefined;
}

export interface ControllerAction {
  path: string | string[];
  fullPaths: string[];
  View: LoadableComponent<{}>;
  method: ((fetchOptions: FetchOptions) => Promise<any>) | undefined;
}

export interface Controller {
  basePath: string;
  actions: ControllerAction[];
}
