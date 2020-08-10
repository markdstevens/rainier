import { logger } from 'rainier-logger/logger';
import { Event } from 'rainier-event/event';
import type { ControllerMatchResponse } from 'rainier-controller/types';
import type { StoresWithRetriever } from 'rainier-store/types';
import { RainierLogLevel } from 'rainier-logger/log-level';

export async function fetchInitialRouteData(
  { controller, fetch, pathParams, queryParams }: ControllerMatchResponse,
  stores: StoresWithRetriever,
  pathname: string
): Promise<any> {
  if (controller) {
    if (controller.isDefault) {
      logger.log({
        event: Event.NO_CONTROLLER_FOUND,
        type: RainierLogLevel.WARN,
        fields: {
          message: `no controller mapping exists found for ${pathname}. Falling back to default controller.`,
          path: pathname,
        },
      });
    }

    return await fetch?.({
      pathParams,
      queryParams,
      stores,
    });
  } else {
    logger.log({
      event: Event.NO_CONTROLLER_FOUND,
      type: RainierLogLevel.WARN,
      fields: {
        message: 'No controller found for request',
        path: pathname,
      },
    });
  }
}
