import React, { FC, useContext, useMemo, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { LoadableComponent } from '@loadable/component';
import { Event } from 'rainier-event';
import { logger } from 'rainier-logger/logger';
import { controllerRegistry } from 'rainier-controller/controller-registry';
import { AllStoreContext, useStore, ServerContextStore } from 'rainier-store';

export const dataView = (View: LoadableComponent<{}>): FC => {
  const DataView = (): JSX.Element => {
    const location = useLocation();
    const params = useParams();
    const stores = useContext(AllStoreContext);
    const serverContextStore = useStore(ServerContextStore);

    const { controller, method, fullPaths, paths } = controllerRegistry.findControllerAndRoute(
      location.pathname
    );

    if (!method) {
      logger.event(
        Event.NO_CONTROLLER_ROUTE_FOUND,
        `no controller route found for ${location.pathname}`
      );
    }

    const clientFetchParams = useMemo(
      () => ({
        params,
        stores,
        fullPaths: fullPaths ?? [],
        routePaths: paths ?? [],
        controllerPath: controller?.basePath ?? '/',
        isServer: typeof window === 'undefined',
      }),
      [location]
    );

    useEffect(() => {
      (async function (): Promise<void> {
        if (method && !serverContextStore.state.isServerLoad) {
          await method(clientFetchParams);
        }
      })();
    }, [clientFetchParams]);

    return <View />;
  };
  DataView.displayName = 'DataView';
  return DataView;
};
