import {
  Controller,
  ControllerViewActionRoute,
  ControllerAction,
  ControllerViewAction,
  RegisteredController,
  RegisteredControllerAction,
  RegisteredControllerViewAction,
  ControllerMatchResponse,
} from './types';
import { dataView } from '../rainier-view';
import { getMatchFromAction, trimSlashes } from '../rainier-util';

const getNormalizedBasePath = (
  isDefaultController: boolean,
  isHomeController: boolean,
  basePath: string
): string => {
  if (isDefaultController) return basePath;
  if (isHomeController) return '';

  return '/' + trimSlashes(basePath);
};

const isControllerViewAction = (action: ControllerAction): action is ControllerViewAction =>
  (action as ControllerViewAction).View !== undefined;

const registeredControllers: RegisteredController[] = [];

export const controllerRegistry = {
  isRegisteredControllerViewAction: (
    action?: RegisteredControllerAction
  ): action is RegisteredControllerViewAction =>
    (action as RegisteredControllerViewAction)?.View !== undefined,

  register: (controller: Controller): void => {
    const registeredControllerActions: RegisteredControllerAction[] = [];

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

    controller.actions?.forEach((action) => {
      const isDefaultAction = !action.paths;
      const normalizedPaths = action.paths?.map((path) => '/' + trimSlashes(path)) ?? ['/*'];

      const registeredControllerAction = {
        paths: normalizedPaths,
        fullPaths: normalizedPaths?.map(
          (normalizedActionPath) => normalizedBasePath + normalizedActionPath
        ),
        method: action.method,
        isDefault: isDefaultAction,
      };

      if (isControllerViewAction(action)) {
        Object.assign(registeredControllerAction, {
          View: action.View,
        });
      }

      registeredControllerActions.push(registeredControllerAction as RegisteredControllerAction);
    });

    registeredControllers.push({
      basePath: normalizedBasePath,
      actions: registeredControllerActions,
      isDefault: isDefaultController,
      isHome: isHomeController,
    });
  },

  getAllViewActions: (): ControllerViewActionRoute[] => {
    const actions: ControllerViewActionRoute[] = [];
    const defaultController = controllerRegistry.defaultController;

    const addViewActions = (controller: RegisteredController): void => {
      controller?.actions?.forEach((action) => {
        if (controllerRegistry.isRegisteredControllerViewAction(action)) {
          const { fullPaths, View, method } = action;
          console.log(fullPaths);
          fullPaths.forEach((fullPath) =>
            actions.push({
              fullPath,
              View: View ? (method ? dataView(View) : View) : undefined,
            })
          );
        }
      });
    };

    registeredControllers
      .filter((controller) => !controller.isDefault)
      .forEach((controller) => addViewActions(controller));

    defaultController && addViewActions(defaultController);

    return actions;
  },

  get defaultController(): RegisteredController | undefined {
    return registeredControllers.find((controller) => controller.isDefault);
  },

  get homeController(): RegisteredController | undefined {
    return registeredControllers.find((controller) => controller.isHome);
  },

  findControllerAndAction: (fullPath: string): ControllerMatchResponse => {
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
            const action = normalizedFullPath.replace(basePath, '');

            return (
              basePath + action === normalizedFullPath && (action === '' || action.startsWith('/'))
            );
          }) || defaultController;
    }

    const actionAndMatch = controller?.actions
      ?.map((action) => ({
        action,
        match: getMatchFromAction(action, fullPath),
      }))
      .find(({ match }) => match?.isExact);

    return {
      controller,
      method: actionAndMatch?.action?.method,
      params: actionAndMatch?.match?.params ?? {},
      paths: actionAndMatch?.action?.paths || [],
      fullPaths: actionAndMatch?.action?.fullPaths || [],
    };
  },
};
