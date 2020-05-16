import { Controller, ControllerActionRoute, ControllerAndAction } from './controller';
import { dataView } from '../rainier-view';

const registeredControllers: Controller[] = [];

export const controllerRegistry = {
  register: (controller: Controller): void => {
    registeredControllers.push(controller);
    controller.actions.forEach((action) => {
      action.fullPaths = [];
      action.path = typeof action.path === 'string' ? [action.path] : action.path;
      action.path.map((p) =>
        action.fullPaths.push((controller.basePath + p).replace(/\/\//g, '/'))
      );
    });
  },

  getAllActions: (): ControllerActionRoute[] => {
    const actions: ControllerActionRoute[] = [];
    registeredControllers
      .map((controller) => controller.actions)
      .forEach((controllerActions) => {
        controllerActions.forEach(({ fullPaths, View, method }) => {
          fullPaths.forEach((fullPath) =>
            actions.push({
              fullPath,
              View: View ? (method ? dataView(View) : View) : undefined,
            })
          );
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
