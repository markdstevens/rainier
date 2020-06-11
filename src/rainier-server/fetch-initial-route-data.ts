import { ControllerMatchResponse } from 'rainier-controller';
import { Stores } from 'rainier-store/types';
import { logger } from 'rainier-logger/logger';
import { Event } from 'rainier-event';

export async function fetchInitialRouteData(
  { controller, fetch, pathParams, queryParams }: ControllerMatchResponse,
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
      pathParams,
      queryParams,
      stores,
    });
  } else {
    logger.event(Event.CONTROLLER_FALLBACK_FAILURE, `Fallback to default controller failed`, {
      path: pathname,
    });
  }
}
