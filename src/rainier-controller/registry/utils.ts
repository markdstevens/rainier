import { ParsedQuery } from 'query-string';
import { trimSlashes, getMatchFromRoute } from 'rainier-util';
import { RegisteredController, RegisteredControllerViewRoute } from 'rainier-controller/types';
import ControllerConstants from './constants';
import { match } from 'react-router-dom';

interface DataForMatchedRoute {
  route: RegisteredControllerViewRoute;
  match: match<{}> | null | undefined;
  queryParams: ParsedQuery;
}

const controllerRegistryUtils = {
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
    basePath: string,
    paths?: string[]
  ): { paths: string[]; fullPaths: string[] } {
    const normalizedPaths = paths?.map(
      (path) => ControllerConstants.ROOT_PATH + trimSlashes(path)
    ) ?? ['/*'];

    const normalizedFullPaths = normalizedPaths?.map(
      (normalizedRoutePath) => basePath + normalizedRoutePath
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

    const homeController = controllerRegistryUtils.getHomeController(registeredControllers);
    const defaultController = controllerRegistryUtils.getDefaultController(registeredControllers);

    if (isHomeRoute && homeController) {
      return homeController;
    } else {
      return (
        registeredControllers
          .filter(({ isDefault }) => !isDefault)
          .find(({ basePath }) => {
            const route = path.replace(basePath, '');

            return basePath + route === path && (route === '' || route.startsWith('/'));
          }) ?? defaultController
      );
    }
  },

  getDataForMatchedRoute(
    path: string,
    queryParams: ParsedQuery,
    controller?: RegisteredController
  ): DataForMatchedRoute | undefined {
    return controller?.routes
      ?.map((route) => ({
        route,
        match: getMatchFromRoute(route, path),
        queryParams,
      }))
      .find(({ match }) => match?.isExact);
  },
};

export default controllerRegistryUtils;
