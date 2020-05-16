import { ControllerAndAction } from '../rainier-controller';
import { getMatchFromAction } from '../rainier-util';
import { Stores } from '../rainier-store/types';
import { logger } from '../rainier-logger/logger';
import { Event } from '../rainier-event';

export async function fetchInitialRouteData(
  { controller, action }: ControllerAndAction,
  stores: Stores,
  pathname: string
): Promise<any> {
  if (controller) {
    return await action?.method?.({
      params: getMatchFromAction(action, pathname)?.params ?? {},
      stores,
      controllerPath: controller.basePath,
      actionPaths: action.path,
      fullPaths: action.fullPaths,
      isServer: true,
    });
  } else {
    logger.event(
      Event.NO_CONTROLLER_ACTION_FOUND,
      `no controller mapping exists found for ${pathname}`,
      {
        path: pathname,
      }
    );
  }
}
