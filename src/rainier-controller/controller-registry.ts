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
import { getMatchFromAction, removeSlashes } from '../rainier-util';

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
    const normalizedBasePath = '/' + removeSlashes(controller.basePath);

    controller.actions?.forEach((action) => {
      const normalizedPaths = action.paths.map((path) => '/' + removeSlashes(path));

      const registeredControllerAction = {
        paths: normalizedPaths,
        fullPaths: normalizedPaths.map((normalizedPath) => normalizedBasePath + normalizedPath),
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
      basePath: normalizedBasePath,
      actions: registeredControllerActions,
    });
  },

  getAllViewActions: (): ControllerViewActionRoute[] => {
    const actions: ControllerViewActionRoute[] = [];

    registeredControllers.forEach((controller) => {
      controller?.actions?.forEach((action) => {
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

  findControllerAndAction: (fullPath: string): ControllerMatchResponse => {
    // remove trailing slash if there is one
    const normalizedFullPath = fullPath.replace('/$', '');

    const controller = registeredControllers.find(({ basePath }) => {
      const action = normalizedFullPath.replace(basePath, '');
      return basePath + action === normalizedFullPath && (action === '' || action.startsWith('/'));
    });

    const actionAndMatch = controller?.actions
      ?.map((action) => ({
        action,
        match: getMatchFromAction(action, fullPath),
      }))
      .find(({ match }) => match?.isExact);

    if (controller && !actionAndMatch) {
      // default controller handling for non-matching requests
    }

    if (!controller && !actionAndMatch) {
      // no match and no default controller handler..fall back to default controller if there is one
    }

    // a full controller-action match was found..yay!
    return {
      controller,
      method: actionAndMatch?.action?.method,
      params: actionAndMatch?.match?.params ?? {},
      paths: actionAndMatch?.action?.paths || [],
      fullPaths: actionAndMatch?.action?.fullPaths || [],
    };
  },
};
