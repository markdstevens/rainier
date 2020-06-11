import {
  Controller,
  ControllerViewRoute,
  RegisteredController,
  RegisteredControllerViewRoute,
  ControllerMatchResponse,
  ReactRouterControllerData,
} from './types';
import { dataView } from 'rainier-view';
import { getMatchFromRoute, trimSlashes } from 'rainier-util';
import { ParsedQuery } from 'query-string';
import { getAggregateViewData } from 'rainier-view/view-data-retriever';

const registeredControllers: RegisteredController[] = [];

const HOME_CONTROLLER_PATH = '';
const DEFAULT_CONTROLLER_PATH = '*';
const ROOT_PATH = '/';

const getNormalizedBasePath = (
  isDefaultController: boolean,
  isHomeController: boolean,
  basePath: string
): string => {
  if (isDefaultController) return basePath;
  if (isHomeController) return HOME_CONTROLLER_PATH;

  return ROOT_PATH + trimSlashes(basePath);
};

export const controllerRegistry = {
  registerController: (controller: Controller): void => {
    const registeredControllerRoutes: RegisteredControllerViewRoute[] = [];

    if (!controller.basePath || controller.basePath === ROOT_PATH) {
      controller.basePath = HOME_CONTROLLER_PATH;
    }

    const isDefaultController = controller.basePath === DEFAULT_CONTROLLER_PATH;
    const isHomeController = controller.basePath === HOME_CONTROLLER_PATH;

    const normalizedBasePath = getNormalizedBasePath(
      isDefaultController,
      isHomeController,
      controller.basePath
    );

    controller.routes?.forEach((route) => {
      const isDefaultRoute = !route.paths;
      const normalizedPaths = route.paths?.map((path) => ROOT_PATH + trimSlashes(path)) ?? ['/*'];
      const normalizedFullPaths = normalizedPaths?.map(
        (normalizedRoutePath) => normalizedBasePath + normalizedRoutePath
      );

      registeredControllerRoutes.push({
        paths: normalizedPaths,
        fullPaths: normalizedFullPaths,
        fetch: route.fetch,
        isDefault: isDefaultRoute,
        View: route.View,
        viewData: route.viewData,
      });
    });

    registeredControllers.push({
      basePath: normalizedBasePath,
      routes: registeredControllerRoutes,
      isDefault: isDefaultController,
      isHome: isHomeController,
      viewData: controller.viewData,
    });
  },

  getAllViewRoutes: (): ReactRouterControllerData[] => {
    const routes: ReactRouterControllerData[] = [];
    const { defaultController } = controllerRegistry;

    const addViewRoutes = (controller: RegisteredController): void => {
      controller.routes.forEach(({ fullPaths, View, fetch }) => {
        fullPaths.forEach((fullPath) => {
          routes.push({
            fullPath,
            View: View ? (fetch ? dataView(View) : View) : undefined,
          });
        });
      });
    };

    registeredControllers
      .filter((controller) => !controller.isDefault)
      .forEach((controller) => addViewRoutes(controller));

    defaultController && addViewRoutes(defaultController);

    return routes;
  },

  get defaultController(): RegisteredController | undefined {
    return registeredControllers.find((controller) => controller.isDefault);
  },

  get homeController(): RegisteredController | undefined {
    return registeredControllers.find((controller) => controller.isHome);
  },

  findControllerAndRoute: (fullPath: string, queryParams: ParsedQuery): ControllerMatchResponse => {
    // remove trailing slash if there is one
    const normalizedFullPath = fullPath.replace('/$', '');

    // counts number of slashes. If there is only 1, then this is a home route
    // (e.g. /about or /blah)
    const isHomeRoute = (normalizedFullPath.match(/\//g) || []).length === 1;

    const { defaultController, homeController } = controllerRegistry;

    let controller;
    if (isHomeRoute && homeController) {
      controller = homeController;
    } else {
      controller =
        registeredControllers
          .filter(({ isDefault }) => !isDefault)
          .find(({ basePath }) => {
            const route = normalizedFullPath.replace(basePath, '');

            return (
              basePath + route === normalizedFullPath && (route === '' || route.startsWith('/'))
            );
          }) || defaultController;
    }

    const matchData = controller?.routes
      ?.map((route) => ({
        route,
        match: getMatchFromRoute(route, fullPath),
        queryParams,
      }))
      .find(({ match }) => match?.isExact);

    return {
      controller,
      fetch: matchData?.route?.fetch,
      pathParams: matchData?.match?.params ?? {},
      queryParams: matchData?.queryParams ?? {},
      viewData: getAggregateViewData(
        controller?.viewData ?? {},
        (matchData?.route as ControllerViewRoute).viewData ?? {}
      ),
    };
  },
};
