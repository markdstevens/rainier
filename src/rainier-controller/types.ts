import { FC } from 'react';
import { LoadableComponent } from '@loadable/component';
import { Stores } from '../rainier-store/types';
/**
 * This object gets passed to every controller route's "fetch" function
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

export type HtmlAttributes = {
  [key: string]: string | boolean;
};

/* Example:
 *   {
 *     type: 'script',
 *     content: 'console.log('blah');'
 *     attributes: {
 *       async: true
 *     }
 *   }
 */
export interface HtmlTag {
  /**
   * The type of tag to append to the DOM
   */
  type: 'script' | 'link' | 'style';
  /**
   * The actual content to insert into the tag
   */
  content?: string;
  /**
   * A map of key-value attributes to add to the tag
   * element.
   */
  attributes?: HtmlAttributes;
}

export interface ViewData {
  /**
   * The title of the page that will be used in the header's
   * <title> tag.
   */
  pageTitle?: string | ((controllerMatch: ControllerMatchResponse) => string);
  /**
   * The text that will be displayed in the event that the user
   * has disabled javascript on the page. The text will be displayed
   * in the <noscript> tag.
   */
  noScriptText?: string | ((controllerMatch: ControllerMatchResponse) => string);
  /**
   * A list of html tags to append to the <head>
   */
  headTags?: HtmlTag[] | ((controllerMatch: ControllerMatchResponse) => HtmlTag[]);
  /**
   * A list of html tags to append to the <body>
   */
  bodyTags?: HtmlTag[] | ((controllerMatch: ControllerMatchResponse) => HtmlTag[]);
}
export interface ControllerViewRoute {
  /**
   * The actual URL mappings. More than 1 path can be defined, but
   * all paths will map to a single View and fetch function.
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
   * The function that will be executed whenever a route's paths matches
   * the current URL. For view routes, this field is optional.
   */
  fetch?: ((fetchOptions: FetchOptions) => Promise<any>) | undefined;
  /**
   * Data that is specific to the route's page like the page title and
   * any custom script/style tags.
   */
  viewData?: ViewData;
}
export interface ControllerApiRoute {
  /**
   * The actual URL mappings. More than 1 path can be defined, but
   * all paths will map to the single fetch function.
   */
  paths: string[];
  /**
   * The function that will be executed whenever a route's paths matches
   * the current URL. For API routes, the "fetch" function must return
   * a JSON-serializable object.
   */
  fetch: (fetchOptions: FetchOptions) => Promise<any>;
}
/**
 * There various types of routes. Currently, there are view routes and
 * api routes. A "view" route is a route that maps a URL to a react
 * component (a view). An "api" route is a route that maps a URL to a
 * JSON object which is sent back to the browser. Api routes cannot, for
 * obvious reasons, have a view. However, api routes must specify a "fetch"
 * function which returns a JSON-serializable object.
 */
export declare type ControllerRoute = ControllerViewRoute | ControllerApiRoute;
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
  /**
   * Data that is specific to the route's page like the page title and
   * any custom script/style tags.
   */
  viewData?: ViewData;
}
export interface RegisteredControllerViewRoute {
  /**
   * All of the relative paths for the route
   */
  paths: string[];
  /**
   * All of the full paths for the route. A full path is equal
   * to the controller's base path plus the relative path.
   */
  fullPaths: string[];
  /**
   * The react component that will be rendered whenever a
   * the route is matched to the current URL.
   */
  View: LoadableComponent<{}>;
  /**
   * The function that will be called to fetch data for the
   * matched controller route.
   */
  fetch?: ((fetchOptions: FetchOptions) => Promise<void>) | undefined;
  /**
   * A flag that indicates if the controller route is the default
   * route or not. The default route is the route that will be used
   * when a request matches the controller but doesn't match any of
   * the other routes.
   */
  isDefault: boolean;
  /**
   * Data that is specific to the route's page like the page title and
   * any custom script/style tags.
   */
  viewData?: ViewData;
}
export interface RegisteredControllerApiRoute {
  /**
   * All of the relative paths for the route
   */
  paths: string[];
  /**
   * All of the full paths for the route. A full path is equal
   * to the controller's base path plus the relative path.
   */
  fullPaths: string[];
  /**
   * The function that will be called to fetch data for the
   * matched controller route.
   */
  fetch: (fetchOptions: FetchOptions) => Promise<void>;
}
export declare type RegisteredControllerRoute =
  | RegisteredControllerViewRoute
  | RegisteredControllerApiRoute;
export interface ControllerMatchResponse {
  /**
   * The controller that matched the request URL
   */
  controller?: RegisteredController;
  /**
   * The function that will be called to fetch data for the
   * request URL.
   */
  fetch?: (fetchOptions: FetchOptions) => Promise<any>;
  /**
   * The URL path params from the request; not the URL
   * parameters.
   */
  params: Params;
  /**
   * All of the relative route paths that map to the matched
   * controller route.
   */
  paths: string[];
  /**
   * All of the full route paths that map to the matched
   * controller route.
   */
  fullPaths: string[];
  /**
   * Data that is specific to the route's page like the page title and
   * any custom script/style tags.
   */
  routeViewData?: ViewData;
  /**
   * Data that is specific to the controller. All data in this field can
   * be overwritten by the more specific "routeViewData".
   */
  controllerViewData?: ViewData;
}
export interface RegisteredController {
  /**
   * The base path of the controller
   */
  basePath: string;
  /**
   * The list of the controller's configured routes
   */
  routes: RegisteredControllerRoute[];
  /**
   * A flag that indicates if the controller is the default
   * controller in the rainier application. The default controller
   * will receive all requests that can't be matched to another
   * controller.
   */
  isDefault: boolean;
  /**
   * A flag that indicates if the controller is the home controller.
   * The home controller is the controller that has a base path of /
   */
  isHome: boolean;
  /**
   * Data that is specific to the route's page like the page title and
   * any custom script/style tags.
   */
  viewData?: ViewData;
}
export interface ReactRouterControllerData {
  fullPath: string;
  View: LoadableComponent<{}> | FC | undefined;
}
