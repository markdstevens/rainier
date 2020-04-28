import React, { FunctionComponent, Profiler } from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import { ErrorBoundary } from './ErrorBoundary';
import { StoreProviders } from './StoreProviders';
import { controllerRegistry } from '@rainier/controller';
import { logger } from '@rainier/logger';
import { Stores } from '@rainier/store';

interface AppProps {
  stores: Stores;
}

export const App: FunctionComponent<AppProps> = ({ stores }: AppProps) => (
  <StoreProviders stores={stores}>
    <PageWrapper>
      <Switch>
        {controllerRegistry.getActionMetaDataForReactRouter().map(({ path, View }) => (
          <Route
            key={path}
            path={path}
            exact={true}
            render={(): JSX.Element => (
              <ErrorBoundary>
                <Profiler id={path} onRender={logger.profile}>
                  {View ? <View /> : null}
                </Profiler>
              </ErrorBoundary>
            )}
          />
        ))}
      </Switch>
    </PageWrapper>
  </StoreProviders>
);
App.displayName = 'App';
