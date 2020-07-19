import { ParsedQuery } from 'query-string';
import { trimSlashes } from 'rainier-util/remove-slashes';
import { getMatchFromRoute } from 'rainier-util/get-match-from-route';
import type { RegisteredController } from 'rainier-controller/types';
import type { DataForMatchedRoute } from 'rainier-controller/registry/types';
import { ControllerConstants } from './constants';

export const controllerRegistryUtils = {
  isHomeController(basePath?: string): basePath is undefined {
    return (
      !basePath ||
      basePath === ControllerConstants.ROOT_PATH ||
      basePath === ControllerConstants.HOME_CONTROLLER_PATH
    );
  },

  isDefaultController(basePath?: string): boolean {
    return basePath === ControllerConstants.DEFAULT_CONTROLLER_PATH;
  },

  getNormalizedBasePath(basePath?: string): string {
    if (controllerRegistryUtils.isHomeController(basePath)) {
      return ControllerConstants.HOME_CONTROLLER_PATH;
    }

    if (controllerRegistryUtils.isDefaultController(basePath)) {
      return ControllerConstants.DEFAULT_CONTROLLER_PATH;
    }

    return ControllerConstants.ROOT_PATH + trimSlashes(basePath);
  },

  getNormalizedRoutePaths(
    normalizedBasePath: string,
    paths?: string[]
  ): { paths: string[]; fullPaths: string[] } {
    const defaultRoutePaths = [
      ControllerConstants.ROOT_PATH + ControllerConstants.DEFAULT_CONTROLLER_PATH,
    ];

    const normalizedPaths =
      paths?.map((path) => ControllerConstants.ROOT_PATH + trimSlashes(path)) ?? defaultRoutePaths;

    const normalizedFullPaths = normalizedPaths.map(
      (normalizedRoutePath) => normalizedBasePath + normalizedRoutePath
    );

    return {
      paths: normalizedPaths,
      fullPaths: normalizedFullPaths,
    };
  },

  getDefaultController(
    registeredControllers: RegisteredController[]
  ): RegisteredController | undefined {
    return registeredControllers.find((controller) => controller.isDefault);
  },

  getHomeController(
    registeredControllers: RegisteredController[]
  ): RegisteredController | undefined {
    return registeredControllers.find((controller) => controller.isHome);
  },

  getControllerFromPath(
    registeredControllers: RegisteredController[],
    path: string
  ): RegisteredController | undefined {
    // counts number of slashes. If there is only 1, then this is a home route
    // (e.g. /about or /blah)
    const isHomeRoute = (path.match(/\//g) || []).length === 1;

    const homeController = isHomeRoute
      ? controllerRegistryUtils.getHomeController(registeredControllers)
      : undefined;
    const defaultController = controllerRegistryUtils.getDefaultController(registeredControllers);

    const controller = registeredControllers
      .filter(({ isDefault, isHome }) => !isDefault && !isHome)
      .find(({ basePath }) => {
        const route = path.replace(basePath, '');

        return basePath + route === path && (route === '' || route.startsWith('/'));
      });

    return controller ?? homeController ?? defaultController;
  },

  getDataForMatchedRoute(
    path: string,
    queryParams: ParsedQuery,
    controller?: RegisteredController
  ): DataForMatchedRoute | undefined {
    return controller?.routes
      .map((route) => ({
        route,
        match: getMatchFromRoute(route, path),
        queryParams,
      }))
      .find(({ match }) => match?.isExact) as DataForMatchedRoute | undefined;
  },
};
