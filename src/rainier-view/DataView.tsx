import React, { FC, useContext, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadableComponent } from '@loadable/component';
import { Event } from 'rainier-event';
import { logger } from 'rainier-logger/logger';
import { controllerRegistry } from 'rainier-controller/registry';
import { AllStoreContext, useStore, ServerContextStore } from 'rainier-store';
import queryString from 'query-string';
import { toRouteMatchHookParams } from 'rainier-lifecycle';

export const dataView = (View: LoadableComponent<{}> | FC): FC => {
  const DataView = (): JSX.Element => {
    const location = useLocation();
    const stores = useContext(AllStoreContext);
    const serverContextStore = useStore(ServerContextStore);

    const controllerMatch = controllerRegistry.findControllerAndRoute(
      location.pathname,
      queryString.parse(location.search)
    );

    if (typeof window !== 'undefined') {
      window.__CLIENT_CONFIG__?.hooks?.onRouteMatch?.(toRouteMatchHookParams(controllerMatch));
    }

    if (!controllerMatch.fetch) {
      logger.event(
        Event.NO_CONTROLLER_ROUTE_FOUND,
        `no controller route found for ${location.pathname}`
      );
    }

    const clientFetchParams = useMemo(
      () => ({
        stores,
        pathParams: controllerMatch.pathParams,
        queryParams: controllerMatch.queryParams,
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
