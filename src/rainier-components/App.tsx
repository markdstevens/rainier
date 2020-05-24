import React, { FunctionComponent, Profiler } from 'react';
import { Route, Switch } from 'react-router-dom';
import { StoreProviders } from './StoreProviders';
import { controllerRegistry } from '../rainier-controller/controller-registry';
import { logger } from '../rainier-logger/logger';
import { Stores } from '../rainier-store/types';
import { PageWrapper } from './PageWrapper';

interface AppProps {
  stores: Stores;
}

export const App: FunctionComponent<AppProps> = ({ stores }: AppProps) => {
  return (
    <StoreProviders stores={stores}>
      <PageWrapper>
        <Switch>
          {controllerRegistry.getAllViewRoutes().map(({ fullPath: path, View }) => (
            <Route
              key={path}
              path={path}
              exact={true}
              render={(): JSX.Element => (
                <Profiler id={path} onRender={logger.profile}>
                  {View ? <View /> : null}
                </Profiler>
              )}
            />
          ))}
        </Switch>
      </PageWrapper>
    </StoreProviders>
  );
};
App.displayName = 'App';
