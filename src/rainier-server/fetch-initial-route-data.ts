import { ControllerMatchResponse } from 'rainier-controller';
import { Stores } from 'rainier-store/types';
import { logger } from 'rainier-logger/logger';
import { Event } from 'rainier-event';

export async function fetchInitialRouteData(
  { controller, fetch, params, paths, fullPaths }: ControllerMatchResponse,
  stores: Stores,
  pathname: string
): Promise<any> {
  if (controller) {
    if (controller.isDefault) {
      logger.event(
        Event.NO_CONTROLLER_FOUND,
        `no controller mapping exists found for ${pathname}. Falling back to default controller.`,
        {
          path: pathname,
        }
      );
    }

    return await fetch?.({
      params,
      stores,
      controllerPath: controller.basePath,
      routePaths: paths,
      fullPaths,
      isServer: true,
    });
  } else {
    logger.event(Event.CONTROLLER_FALLBACK_FAILURE, `Fallback to default controller failed`, {
      path: pathname,
    });
  }
}
