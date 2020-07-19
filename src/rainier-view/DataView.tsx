import React, { useMemo, useEffect, useContext } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { LoadableComponent } from '@loadable/component';
import { toRouteMatchHookParams } from 'rainier-lifecycle/to-route-match-hook-params';
import { useStore } from 'rainier-store/useStore';
import { StoresContext } from 'rainier-components/StoreProviders';
import { ServerContextStore } from 'rainier-store/types';
import type { FC } from 'react';
import type { ControllerRegistry } from 'rainier-controller/registry/types';

export const dataView = (
  View: LoadableComponent<{}> | FC,
  controllerRegistry: ControllerRegistry
): FC => {
  const DataView = (): JSX.Element => {
    const location = useLocation();
    const stores = useContext(StoresContext);
    const serverContextStore = useStore<ServerContextStore>('serverContextStore');

    const controllerMatch = controllerRegistry.findControllerAndRoute(
      location.pathname,
      queryString.parse(location.search)
    );

    if (!serverContextStore.isServerLoad) {
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
        if (
          controllerMatch.fetch &&
          (!serverContextStore.isServerLoad || serverContextStore.isAppShellRequest)
        ) {
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
