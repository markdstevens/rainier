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

    const controllerMatch = controllerRegistry.findControllerAndRoute(location.pathname);

    if (typeof window !== 'undefined') {
      window.__CLIENT_CONFIG__?.hooks?.onRouteMatch?.(controllerMatch);
    }

    if (!controllerMatch.fetch) {
      logger.event(
        Event.NO_CONTROLLER_ROUTE_FOUND,
        `no controller route found for ${location.pathname}`
      );
    }

    const clientFetchParams = useMemo(
      () => ({
        params,
        stores,
        fullPaths: controllerMatch.fullPaths ?? [],
        routePaths: controllerMatch.paths ?? [],
        controllerPath: controllerMatch.controller?.basePath ?? '/',
        isServer: typeof window === 'undefined',
      }),
      [location]
    );

    useEffect(() => {
      (async function (): Promise<void> {
        if (controllerMatch.fetch && !serverContextStore.state.isServerLoad) {
          await controllerMatch.fetch(clientFetchParams);
          await window.__CLIENT_CONFIG__?.hooks?.onAfterClientDataFetch?.(stores);
        }
      })();
    }, [clientFetchParams]);

    return <View />;
  };
  DataView.displayName = 'DataView';
  return DataView;
};
