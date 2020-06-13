import {
  Controller,
  ControllerViewRoute,
  RegisteredController,
  RegisteredControllerViewRoute,
  ControllerMatchResponse,
  ReactRouterControllerData,
} from '../types';
import { dataView } from 'rainier-view';
import { ParsedQuery } from 'query-string';
import { getAggregateViewData } from 'rainier-view/view-data-retriever';
import ControllerRegistryUtils from './utils';

const registeredControllers: RegisteredController[] = [];

export const controllerRegistry = {
  registerController: (controller: Controller): void => {
    const registeredControllerViewRoutes: RegisteredControllerViewRoute[] = [];
    const normalizedBasePath = ControllerRegistryUtils.getNormalizedBasePath(controller.basePath);

    controller.routes?.forEach(({ paths: rawPaths, fetch, View, viewData }) => {
      const { paths, fullPaths } = ControllerRegistryUtils.getNormalizedRoutePaths(
        normalizedBasePath,
        rawPaths
      );

      registeredControllerViewRoutes.push({
        isDefault: !rawPaths,
        paths,
        fullPaths,
        fetch,
        View,
        viewData,
      });
    });

    registeredControllers.push({
      basePath: normalizedBasePath,
      routes: registeredControllerViewRoutes,
      viewData: controller.viewData,
      isDefault: ControllerRegistryUtils.isDefaultController(normalizedBasePath),
      isHome: ControllerRegistryUtils.isHomeController(normalizedBasePath),
    });
  },

  getControllerViewRoutes(controller: RegisteredController): ReactRouterControllerData[] {
    return controller.routes
      .map(({ fullPaths, View, fetch }) =>
        fullPaths.map((fullPath) => ({
          fullPath,
          View: View ? (fetch ? dataView(View) : View) : undefined,
        }))
      )
      .flat();
  },

  get reactRouterControllerData(): ReactRouterControllerData[] {
    const routes: ReactRouterControllerData[] = [];
    const defaultController = ControllerRegistryUtils.getDefaultController(registeredControllers);

    registeredControllers
      .filter((controller) => !controller.isDefault)
      .map((controller) => controllerRegistry.getControllerViewRoutes(controller))
      .forEach((controllerViewRoutes) => routes.push(...controllerViewRoutes));

    defaultController &&
      controllerRegistry
        .getControllerViewRoutes(defaultController)
        .forEach((controllerViewRoutes) => routes.push(controllerViewRoutes));

    return routes;
  },

  findControllerAndRoute: (fullPath: string, queryParams: ParsedQuery): ControllerMatchResponse => {
    // remove trailing slash (e.g. /todos/ becomes /todos)
    const normalizedFullPath = fullPath.replace('/$', '');

    const controller = ControllerRegistryUtils.getControllerFromPath(
      registeredControllers,
      normalizedFullPath
    );

    const dataForMatchedRoute = ControllerRegistryUtils.getDataForMatchedRoute(
      normalizedFullPath,
      queryParams,
      controller
    );

    return {
      controller,
      fetch: dataForMatchedRoute?.route?.fetch,
      pathParams: dataForMatchedRoute?.match?.params ?? {},
      queryParams: dataForMatchedRoute?.queryParams ?? {},
      viewData: getAggregateViewData(
        controller?.viewData ?? {},
        (dataForMatchedRoute?.route as ControllerViewRoute).viewData ?? {}
      ),
    };
  },
};
