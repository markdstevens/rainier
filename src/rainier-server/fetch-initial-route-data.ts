import { logger } from 'rainier-logger/logger';
import { Event } from 'rainier-event/event';
import type { ControllerMatchResponse } from 'rainier-controller/types';
import type { StoresWithRetriever } from 'rainier-store/types';

export async function fetchInitialRouteData(
  { controller, fetch, pathParams, queryParams }: ControllerMatchResponse,
  stores: StoresWithRetriever,
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
    logger.event(Event.NO_CONTROLLER_FOUND, `No controller found for request`, {
      path: pathname,
    });
  }
}
