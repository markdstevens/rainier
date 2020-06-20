import { ParsedQuery } from 'query-string';
import { dataView } from 'rainier-view/DataView';
import { getAggregateViewData } from 'rainier-view/view-data-retriever';
import { collectionUtils } from 'rainier-util/collection-utils';
import { controllerRegistryUtils } from './utils';
import type { ControllerRegistry } from './types';
import type {
  ControllerViewRoute,
  RegisteredController,
  RegisteredControllerViewRoute,
  ControllerMatchResponse,
  ReactRouterControllerData,
  Controller,
} from '../types';

export function initControllerRegistry(controllers: Controller[] = []): ControllerRegistry {
  const registeredControllers: RegisteredController[] = [];

  function getControllerViewRoutes(controller: RegisteredController): ReactRouterControllerData[] {
    const defaultRoute = controller.routes.find((route) => route.isDefaultRoute);
    const nonDefaultRoutes = controller.routes.filter((route) => !route.isDefaultRoute);

    return [...nonDefaultRoutes, defaultRoute]
      .filter(collectionUtils.isNotNullOrUndefined)
      .map(({ fullPaths, View }) =>
        fullPaths.map((fullPath) => ({
          fullPath,
          View,
        }))
      )
      .flat();
  }

  const controllerRegistry = {
    getReactRouterControllerData(): ReactRouterControllerData[] {
      const routes: ReactRouterControllerData[] = [];
      const defaultController = controllerRegistryUtils.getDefaultController(registeredControllers);

      registeredControllers
        .filter((controller) => !controller.isDefault)
        .map((controller) => getControllerViewRoutes(controller))
        .forEach((controllerViewRoutes) => routes.push(...controllerViewRoutes));

      defaultController &&
        getControllerViewRoutes(defaultController).forEach((controllerViewRoutes) =>
          routes.push(controllerViewRoutes)
        );

      return routes;
    },

    findControllerAndRoute: (
      fullPath: string,
      queryParams: ParsedQuery
    ): ControllerMatchResponse => {
      // remove trailing slash (e.g. /todos/ becomes /todos)
      const normalizedFullPath = fullPath.replace('/$', '');

      const controller = controllerRegistryUtils.getControllerFromPath(
        registeredControllers,
        normalizedFullPath
      );

      const dataForMatchedRoute = controllerRegistryUtils.getDataForMatchedRoute(
        normalizedFullPath,
        queryParams,
        controller
      );

      return {
        controller,
        fetch: dataForMatchedRoute?.route.fetch,
        pathParams: dataForMatchedRoute?.match.params ?? {},
        queryParams: dataForMatchedRoute?.queryParams ?? {},
        viewData: getAggregateViewData(
          controller?.viewData ?? {},
          (dataForMatchedRoute?.route as ControllerViewRoute)?.viewData ?? {}
        ),
      };
    },
  };

  controllers.forEach((controller) => {
    const registeredControllerViewRoutes: RegisteredControllerViewRoute[] = [];
    const normalizedBasePath = controllerRegistryUtils.getNormalizedBasePath(controller.basePath);

    controller.routes?.forEach(({ paths: rawPaths, fetch, View, viewData }) => {
      const { paths, fullPaths } = controllerRegistryUtils.getNormalizedRoutePaths(
        normalizedBasePath,
        rawPaths
      );

      registeredControllerViewRoutes.push({
        paths,
        fullPaths,
        fetch,
        View: fetch ? dataView(View, controllerRegistry) : View,
        viewData,
        isDefaultRoute: !rawPaths || !rawPaths.length,
      });
    });

    registeredControllers.push({
      basePath: normalizedBasePath,
      routes: registeredControllerViewRoutes,
      viewData: controller.viewData,
      isDefault: controllerRegistryUtils.isDefaultController(normalizedBasePath),
      isHome: controllerRegistryUtils.isHomeController(normalizedBasePath),
    });
  });

  return controllerRegistry;
}
