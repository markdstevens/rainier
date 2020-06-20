import type { FC } from 'react';
import type { ParsedQuery } from 'query-string';
import type { LoadableComponent } from '@loadable/component';
import type { StoresWithRetriever } from 'rainier-store/types';
import type { NormalizedViewData } from 'rainier-view/types';

/**
 * This object gets passed to every controller route's "fetch" function
 */
interface FetchOptions {
  /**
   * The URL query params from the request; distinct from
   * the URL path parameters. Note that all query params
   * will be converted to strings, so you must transform
   * them into the appropriate data type yourself.
   *
   * Example - given this URL:
   *   path: /todos/show?id=5&priority=HIGH
   *
   * Then the queryParams will be: { id: "5", priority: "TOP" }
   */
  queryParams: ParsedQuery;
  /**
   * The URL path params from the request; distinct from
   * the URL query parameters. Note that all path params
   * will be converted to strings, so you must transform
   * them into the appropriate data type yourself.
   *
   * Example - given this configuration:
   *   path: /todos/show/:id
   *   URL: /todos/show/5
   *
   * Then the pathParams will be: { id: "5" }
   */
  pathParams: Params;
  /**
   * All of the platform and user-defined stores. Stores can be retrieved
   * by using the stores.get(...) function.
   */
  stores: StoresWithRetriever;
}
interface Params {
  [key: string]: string | number | boolean;
}

type HtmlAttributes = {
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
interface HtmlTag {
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

interface ViewData {
  /**
   * The title of the page that will be used in the header's
   * <title> tag.
   */
  pageTitle?: string | (() => string);
  /**
   * The text that will be displayed in the event that the user
   * has disabled javascript on the page. The text will be displayed
   * in the <noscript> tag.
   */
  noScriptText?: string | (() => string);
  /**
   * A list of html tags to append to the <head>
   */
  headTags?: HtmlTag[] | (() => HtmlTag[]);
  /**
   * A list of html tags to append to the <body>
   */
  bodyTags?: HtmlTag[] | (() => HtmlTag[]);
}
interface ControllerViewRoute {
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
/**
 * There various types of routes. Currently, there are view routes and
 * api routes. A "view" route is a route that maps a URL to a react
 * component (a view). An "api" route is a route that maps a URL to a
 * JSON object which is sent back to the browser. Api routes cannot, for
 * obvious reasons, have a view. However, api routes must specify a "fetch"
 * function which returns a JSON-serializable object.
 */
type ControllerRoute = ControllerViewRoute;
/**
 * Controllers are the backbone of the rainier framework. At their simplest,
 * controllers map URLs to react components (views). Controllers can also:
 *
 *   1. Associate related URL mappings into a single configuration
 *   2. Fetch initial page data
 */
interface Controller {
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
interface RegisteredControllerViewRoute {
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
  View: LoadableComponent<{}> | React.FC;
  /**
   * The function that will be called to fetch data for the
   * matched controller route.
   */
  fetch?: ((fetchOptions: FetchOptions) => Promise<void>) | undefined;
  /**
   * Data that is specific to the route's page like the page title and
   * any custom script/style tags.
   */
  viewData?: ViewData;
  /**
   * Will be true if the route is the "catch-all" route for the controller
   */
  isDefaultRoute: boolean;
}

interface ControllerMatchResponse {
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
   * The URL path params from the request; distinct from
   * the URL query parameters. Note that all path params
   * will be converted to strings, so you must transform
   * them into the appropriate data type yourself.
   *
   * Example - given this configuration:
   *   path: /todos/show/:id
   *   URL: /todos/show/5
   *
   * Then the pathParams will be: { id: "5" }
   */
  pathParams: Params;
  /**
   * The URL query params from the request; distinct from
   * the URL path parameters. Note that all query params
   * will be converted to strings, so you must transform
   * them into the appropriate data type yourself.
   *
   * Example - given this URL:
   *   path: /todos/show?id=5&priority=HIGH
   *
   * Then the queryParams will be: { id: "5", priority: "TOP" }
   */
  queryParams: ParsedQuery;
  /**
   * Data that is specific to the route's page like the page title and
   * any custom script/style tags.
   */
  viewData: NormalizedViewData;
}
interface RegisteredController {
  /**
   * The base path of the controller
   */
  basePath: string;
  /**
   * The list of the controller's configured routes
   */
  routes: RegisteredControllerViewRoute[];
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
interface ReactRouterControllerData {
  fullPath: string;
  View: LoadableComponent<{}> | FC | undefined;
}

export type {
  FetchOptions,
  Params,
  HtmlAttributes,
  HtmlTag,
  ViewData,
  ControllerViewRoute,
  ControllerRoute,
  Controller,
  RegisteredControllerViewRoute,
  ControllerMatchResponse,
  RegisteredController,
  ReactRouterControllerData,
};
