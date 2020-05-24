import {
  Controller,
  ControllerRoute,
  ControllerViewRoute,
  RegisteredController,
  RegisteredControllerRoute,
  RegisteredControllerViewRoute,
  ControllerMatchResponse,
  ReactRouterControllerData,
} from './types';
import { dataView } from '../rainier-view';
import { getMatchFromRoute, trimSlashes } from '../rainier-util';

const getNormalizedBasePath = (
  isDefaultController: boolean,
  isHomeController: boolean,
  basePath: string
): string => {
  if (isDefaultController) return basePath;
  if (isHomeController) return '';

  return '/' + trimSlashes(basePath);
};

const isControllerViewRoute = (route: ControllerRoute): route is ControllerViewRoute =>
  (route as ControllerViewRoute).View !== undefined;

const registeredControllers: RegisteredController[] = [];

export const controllerRegistry = {
  isRegisteredControllerViewRoute: (
    route?: RegisteredControllerRoute
  ): route is RegisteredControllerViewRoute =>
    (route as RegisteredControllerViewRoute)?.View !== undefined,

  register: (controller: Controller): void => {
    const registeredControllerRoutes: RegisteredControllerRoute[] = [];

    // when no base path is specified, default to "home" controller
    if (!controller.basePath) {
      controller.basePath = '';
    }

    const isDefaultController = controller.basePath === '*';
    const isHomeController = controller.basePath === '/' || controller.basePath === '';

    const normalizedBasePath = getNormalizedBasePath(
      isDefaultController,
      isHomeController,
      controller.basePath
    );

    controller.routes?.forEach((route) => {
      const isDefaultRoute = !route.paths;
      const normalizedPaths = route.paths?.map((path) => '/' + trimSlashes(path)) ?? ['/*'];

      const registeredControllerRoute = {
        paths: normalizedPaths,
        fullPaths: normalizedPaths?.map(
          (normalizedRoutePath) => normalizedBasePath + normalizedRoutePath
        ),
        method: route.method,
        isDefault: isDefaultRoute,
      };

      if (isControllerViewRoute(route)) {
        Object.assign(registeredControllerRoute, {
          View: route.View,
        });
      }

      console.log(registeredControllerRoute);

      registeredControllerRoutes.push(registeredControllerRoute as RegisteredControllerRoute);
    });

    registeredControllers.push({
      basePath: normalizedBasePath,
      routes: registeredControllerRoutes,
      isDefault: isDefaultController,
      isHome: isHomeController,
    });
  },

  getAllViewRoutes: (): ReactRouterControllerData[] => {
    const routes: ReactRouterControllerData[] = [];
    const defaultController = controllerRegistry.defaultController;

    const addViewRoutes = (controller: RegisteredController): void => {
      controller?.routes?.forEach((route) => {
        if (controllerRegistry.isRegisteredControllerViewRoute(route)) {
          const { fullPaths, View, method } = route;
          console.log(fullPaths);
          fullPaths.forEach((fullPath) =>
            routes.push({
              fullPath,
              View: View ? (method ? dataView(View) : View) : undefined,
            })
          );
        }
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

  findControllerAndRoute: (fullPath: string): ControllerMatchResponse => {
    // remove trailing slash if there is one
    const normalizedFullPath = fullPath.replace('/$', '');

    // counts number of slashes. If there is only 1, then this is a home route
    // (e.g. /about or /blah)
    const isHomeRoute = (normalizedFullPath.match(/\//g) || []).length === 1;

    const defaultController = controllerRegistry.defaultController;
    const homeController = controllerRegistry.homeController;

    let controller;
    if (isHomeRoute && homeController) {
      controller = homeController;
    } else {
      controller =
        registeredControllers
          .filter(({ isDefault, isHome }) => !isDefault && !isHome)
          .find(({ basePath }) => {
            const route = normalizedFullPath.replace(basePath, '');

            return (
              basePath + route === normalizedFullPath && (route === '' || route.startsWith('/'))
            );
          }) || defaultController;
    }

    const routeAndMatch = controller?.routes
      ?.map((route) => ({
        route,
        match: getMatchFromRoute(route, fullPath),
      }))
      .find(({ match }) => match?.isExact);

    return {
      controller,
      method: routeAndMatch?.route?.method,
      params: routeAndMatch?.match?.params ?? {},
      paths: routeAndMatch?.route?.paths || [],
      fullPaths: routeAndMatch?.route?.fullPaths || [],
    };
  },
};
