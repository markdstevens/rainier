import { ControllerMatchResponse } from '../rainier-controller';
import { Stores } from '../rainier-store/types';
import { logger } from '../rainier-logger/logger';
import { Event } from '../rainier-event';

export async function fetchInitialRouteData(
  { controller, method, params, paths, fullPaths }: ControllerMatchResponse,
  stores: Stores,
  pathname: string
): Promise<any> {
  if (controller) {
    return await method?.({
      params,
      stores,
      controllerPath: controller.basePath,
      actionPaths: paths,
      fullPaths,
      isServer: true,
    });
  } else {
    logger.event(
      Event.NO_CONTROLLER_ACTION_FOUND,
      `no controller mapping exists found for ${pathname}. Falling back to default controller.`,
      {
        path: pathname,
      }
    );
  }
}
