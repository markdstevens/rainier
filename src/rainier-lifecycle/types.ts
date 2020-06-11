import { Request, Response, NextFunction } from 'express';
import { ControllerMatchResponse, ViewData, Params } from 'rainier-controller';
import { Stores } from 'rainier-store';
import { ParsedQuery } from 'query-string';

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export interface RainierClientHooks {
  /**
   * A hook that is called immediately after the stores have been
   * initialized on the client.
   *
   * @param stores The newly instantiated stores. The stores' state
   * can be mutated at this phase.
   *
   * The hook can be synchronous or asynchronous.
   */
  onAfterStoreInit?: (stores: Stores) => void | Promise<void>;
  /**
   * A hook that is called immediately after a client's route changes
   * and has been matched to a controller and route.
   *
   * @param controllerMatch The controller and route match data
   *
   * The hook can be synchronous or asynchronous.
   */
  onRouteMatch?: (controllerMatch?: ControllerMatchResponse) => void | Promise<void>;
  /**
   * A hook that is called immediately after a client has fetched
   * data.
   *
   * @param stores All of the application stores as they are post-fetch.
   * The stores' state can be mutated at this phase.
   *
   * The hook can be synchronous or asynchronous.
   */
  onAfterClientDataFetch?: (stores: Stores) => void | Promise<void>;
}

export interface RainierServerHooks {
  /**
   * A hook that is called immediately after the stores have been
   * initialized on the server.
   *
   * @param stores The newly instantiated stores. The stores' state
   * can be mutated at this phase.
   *
   * The hook can be synchronous or asynchronous.
   */
  onAfterStoreInit?: (stores: Stores) => void | Promise<void>;
  /**
   * A hook that is called immediately after a server's request URL
   * has been matched to a controller and route.
   *
   * @param controllerMatch The controller and route match data
   *
   * The hook can be synchronous or asynchronous.
   */
  onRouteMatch?: (routeMatchData?: RouteMatchData) => void | Promise<void>;
  /**
   * A hook that is called immediately after the server has fetched
   * data.
   *
   * @param stores All of the application stores as they are post-fetch.
   * The stores' state can be mutated at this phase.
   *
   * The hook can be synchronous or asynchronous.
   */
  onAfterServerDataFetch?: (stores: Stores) => void | Promise<void>;
  /**
   * A hook that is called immediately before the server response is sent
   * to the browser.
   *
   * The hook can be synchronous or asynchronous.
   */
  onBeforeServerRender?: () => void | Promise<void>;
}

export interface RainierServerConfig {
  /**
   * A server hook is a hook that is only fired on the express server
   * at a particular phase of the rainier application lifecycle.
   *
   * Each hook is a function that can be either synchronous or
   * asynchronous. Some hooks pass arguments like stores,
   * controller matches, etc; these arguments can optionally be
   * mutated depending on your needs.
   */
  hooks?: RainierServerHooks;
  /**
   * Middleware is a list of express-compliant middleware as defined in
   * the express documentation:
   *
   * https://expressjs.com/en/guide/using-middleware.html
   *
   * All middleware function specified in this list will be added to the
   * express middleware in the order that they are specified.
   */
  middleware?: ExpressMiddleware[];
}

export interface RainierClientConfig {
  /**
   * A client hook is a hook that is only fired on the browser
   * at a particular phase of the rainier application lifecycle.
   *
   * Each hook is a function that can be either synchronous or
   * asynchronous. Some hooks pass arguments like stores,
   * controller matches, etc; these arguments can optionally be
   * mutated depending on your needs.
   */
  hooks?: RainierClientHooks;
}

export interface RouteMatchData {
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
   * Data that is specific to the matched route's page.
   *
   * e.g. page title, custom script/style tags, etc.
   */
  viewData: ViewData;
  /**
   * Name of the controller that matched the route
   */
  controllerBasePath: string;
}
