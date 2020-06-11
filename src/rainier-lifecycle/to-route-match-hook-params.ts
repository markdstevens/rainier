import { ControllerMatchResponse } from 'rainier-controller';
import { RouteMatchData } from './types';

export function toRouteMatchHookParams(
  controllerAndMatch: ControllerMatchResponse
): RouteMatchData {
  return {
    controllerBasePath: controllerAndMatch.controller?.basePath ?? '',
    queryParams: controllerAndMatch.queryParams,
    pathParams: controllerAndMatch.pathParams,
    viewData: controllerAndMatch.viewData,
  };
}
