import React, { FC, useContext, useMemo, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { LoadableComponent } from '@loadable/component';
import { Event } from '../rainier-event';
import { logger } from '../rainier-logger/logger';
import { controllerRegistry } from '../rainier-controller/controller-registry';
import { AllStoreContext } from '../rainier-store/all-store-context';
import { useServerContextStore } from '../rainier-store/server-context-store';

export const dataView = (View: LoadableComponent<{}>): FC => {
  const DataView = (): JSX.Element => {
    const location = useLocation();
    const params = useParams();
    const stores = useContext(AllStoreContext);
    const [serverContextState] = useServerContextStore();

    const action = controllerRegistry.findActionByFullPath(location.pathname);

    if (!action?.method) {
      logger.event(
        Event.NO_CONTROLLER_ACTION_FOUND,
        `no controller action found for ${location.pathname}`
      );
    }

    const clientFetchParams = useMemo(
      () => ({
        params,
        stores,
        fullPaths: action?.fullPaths ?? [],
        actionPaths: action?.paths ?? [],
        controllerPath: action?.controller.basePath ?? '/',
        isServer: typeof window === 'undefined',
      }),
      [location]
    );

    useEffect(() => {
      (async function (): Promise<void> {
        if (action?.method && !serverContextState.isServerLoad) {
          await action?.method(clientFetchParams);
        }
      })();
    }, [clientFetchParams]);

    return <View />;
  };
  DataView.displayName = 'DataView';
  return DataView;
};
