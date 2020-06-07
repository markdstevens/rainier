import { FC } from 'react';
import { LoadableComponent } from '@loadable/component';
import { Stores } from 'rainier-store/types';

/**
 * This object gets passed to every controller route's "method" function
 */
export interface FetchOptions {
  /**
   * An object representing the result of react-router's matchPath function.
   * If you define a route of /todos/show/:id and a customer then accessess
   * /todos/show/1, then the value of "params" will be: { id: '1' }
   */
  params: Params;
  /**
   * All of the platform and user-defined stores. Stores can be retrieved
   * by using the stores.get(...) function.
   */
  stores: Stores;
  /**
   * All of the defined routes that map to the customer's current URL. For
   * example, if you've defined a controller action with two matching URL
   * patterns like this:
   *
   * {
   *  paths: ["/show/foo", "/show/bar"],
   *  ...
   * }
   *
   * Then the value of "routePaths" for a customer accessing /show/foo would
   * be:
   *
   * [ '/show/foo', '/show/bar' ]
   */
  routePaths: string[] | string;
  /**
   * Same as "routePaths" with the exception that each path includes the
   * controller's base path as well. In the example in "routePaths", if
   * the basePath was /todos, then the value of "fullPaths" would be:
   *
   * [ '/todos/show/foo', '/todos/show/bar' ]
   */
  fullPaths: string[];
  /**
   * The controller's base path
   */
  controllerPath: string;
  /**
   * True when executing on the server. False when executing on the client.
   */
  isServer: boolean;
}

export interface Params {
  [key: string]: string | number | boolean;
}

export interface ControllerViewRoute {
  /**
   * The actual URL mappings. More than 1 path can be defined, but
   * all paths will map to a single View and method.
   */
  paths?: string[];
  /**
   * The react component that will be rendered whenever a route's paths
   * matches the current URL. A view can be a simple react component or
   * a LoadableComponent. If the view is a LoadableComponent, webpack will
   * automatically create a separate chunk for the view and it's unique
   * dependencies. This feature is what allows route-based code splitting.
   */
  View: LoadableComponent<{}> | FC;
  /**
   * The method that will be executed whenever a route's paths matches
   * the current URL. For view routes, this field is optional.
   */
  method?: ((fetchOptions: FetchOptions) => Promise<any>) | undefined;
}

export interface ControllerApiRoute {
  /**
   * The actual URL mappings. More than 1 path can be defined, but
   * all paths will map to the single "method" function.
   */
  paths: string[];
  /**
   * The method that will be executed whenever a route's paths matches
   * the current URL. For API routes, the "method" function must return
   * a JSON-serializable object.
   */
  method: (fetchOptions: FetchOptions) => Promise<any>;
}

/**
 * There various types of routes. Currently, there are view routes and
 * api routes. A "view" route is a route that maps a URL to a react
 * component (a view). An "api" route is a route that maps a URL to a
 * JSON object which is sent back to the browser. Api routes cannot, for
 * obvious reasons, have a view. However, api routes must have a method
 * which returns a JSON-serializable object.
 */
export type ControllerRoute = ControllerViewRoute | ControllerApiRoute;

/**
 * Controllers are the backbone of the rainier framework. At their simplest,
 * controllers map URLs to react components (views). Controllers can also:
 *
 *   1. Associate related URL mappings into a single configuration
 *   2. Fetch initial page data
 */
export interface Controller {
  /**
   * The base path will be prepended to each path that's defined in the controller's
   * routes. This configuration will match /todos/show:
   *
   * {
   *   basePath: '/todos',
   *   routes: [
   *     {
   *       paths: ['/show']
   *     }
   *   ]
   * }
   */
  basePath?: string;
  /**
   * The individual routes that define actual endpoints and their view mappings.
   */
  routes?: ControllerRoute[];
}
