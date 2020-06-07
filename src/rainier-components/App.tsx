import React, { FC, Profiler } from 'react';
import { Route, Switch } from 'react-router-dom';
import { controllerRegistry } from 'rainier-controller/controller-registry';
import { logger } from 'rainier-logger/logger';
import { Stores } from 'rainier-store/types';
import { StoreProviders } from './StoreProviders';
import { PageWrapper } from './PageWrapper';

interface AppProps {
  stores: Stores;
}

export const App: FC<AppProps> = ({ stores }: AppProps) => (
  <StoreProviders stores={stores}>
    <PageWrapper>
      <Switch>
        {controllerRegistry.getAllViewRoutes().map(
          ({ fullPath: path, View }) =>
            View && (
              <Route
                key={path}
                path={path}
                exact={true}
                render={(): JSX.Element => (
                  <Profiler id={path} onRender={logger.profile}>
                    <View />
                  </Profiler>
                )}
              />
            )
        )}
      </Switch>
    </PageWrapper>
  </StoreProviders>
);
App.displayName = 'App';
