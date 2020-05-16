import {
  Controller,
  ControllerViewActionRoute,
  ControllerAndAction,
  ControllerAction,
  ControllerViewAction,
  RegisteredController,
  RegisteredControllerAction,
  RegisteredControllerViewAction,
} from './types';
import { dataView } from '../rainier-view';

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
    controller.actions.forEach((action) => {
      const registeredControllerAction = {
        paths: action.paths,
        fullPaths: action.paths.map((path) => (controller.basePath + path).replace(/\/\//g, '/')),
        method: action.method,
      };

      if (isControllerViewAction(action)) {
        Object.assign(registeredControllerAction, {
          View: action.View,
        });
      }

      registeredControllerActions.push(registeredControllerAction as RegisteredControllerAction);
    });

    registeredControllers.push({
      basePath: controller.basePath,
      actions: registeredControllerActions,
    });
  },

  getAllViewActions: (): ControllerViewActionRoute[] => {
    const actions: ControllerViewActionRoute[] = [];

    registeredControllers
      .map((controller) => controller.actions)
      .forEach((controllerActions) => {
        controllerActions.forEach((action) => {
          if (controllerRegistry.isRegisteredControllerViewAction(action)) {
            const { fullPaths, View, method } = action;
            fullPaths.forEach((fullPath) =>
              actions.push({
                fullPath,
                View: View ? (method ? dataView(View) : View) : undefined,
              })
            );
          }
        });
      });

    return actions;
  },

  findControllerAndAction: (fullPath: string): ControllerAndAction => {
    const controller = registeredControllers.find((registeredController) =>
      fullPath.startsWith(registeredController.basePath)
    );
    const action = controller?.actions.find((action) => action.fullPaths.includes(fullPath));

    return {
      controller,
      action,
    };
  },
};
