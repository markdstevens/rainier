import React, { useContext, useMemo, useEffect } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { LoadableComponent } from '@loadable/component';
import { AllStoreContext } from 'rainier-store/all-store-context';
import { useStore } from 'rainier-store/useStore';
import { ServerContextStore } from 'rainier-store/server-context-store';
import { toRouteMatchHookParams } from 'rainier-lifecycle/to-route-match-hook-params';
import type { FC } from 'react';
import type { ControllerRegistry } from 'rainier-controller/registry/types';

export const dataView = (
  View: LoadableComponent<{}> | FC,
  controllerRegistry: ControllerRegistry
): FC => {
  const DataView = (): JSX.Element => {
    const location = useLocation();
    const stores = useContext(AllStoreContext);
    const serverContextStore = useStore(ServerContextStore);

    const controllerMatch = controllerRegistry.findControllerAndRoute(
      location.pathname,
      queryString.parse(location.search)
    );

    if (!serverContextStore.state.isServerLoad) {
      window.__CLIENT_CONFIG__?.hooks?.onRouteMatch?.(toRouteMatchHookParams(controllerMatch));
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
