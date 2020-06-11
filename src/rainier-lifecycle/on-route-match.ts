import { ControllerMatchResponse, Params, ViewData } from 'rainier-controller';
import { ParsedQuery } from 'query-string';

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

export function toRouteMatchParams(controllerAndMatch: ControllerMatchResponse): RouteMatchData {
  return {
    controllerBasePath: controllerAndMatch.controller?.basePath ?? '',
    queryParams: controllerAndMatch.queryParams,
    pathParams: controllerAndMatch.pathParams,
    viewData: controllerAndMatch.viewData,
  };
}
