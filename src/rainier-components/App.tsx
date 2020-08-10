import React, { FC, Profiler } from 'react';
import { Route, Switch } from 'react-router-dom';
import { logger } from 'rainier-logger/logger';
import { StoreProviders } from './StoreProviders';
import { PageWrapper } from './PageWrapper';
import type { AppProps } from './types';
import { Event } from 'rainier-event';
import { RainierLogLevel } from 'rainier-logger/log-level';

export const App: FC<AppProps> = ({
  stores,
  controllerRegistry,
  htmlTagManager,
  renderShellOnly,
}: AppProps) => (
  <StoreProviders stores={stores}>
    <PageWrapper controllerRegistry={controllerRegistry} htmlTagManager={htmlTagManager}>
      {!renderShellOnly && (
        <Switch>
          {controllerRegistry.getReactRouterControllerData().map(
            ({ fullPath: path, View }) =>
              View && (
                <Route
                  key={path}
                  path={path}
                  exact={true}
                  render={(): JSX.Element => (
                    <Profiler
                      id={path}
                      onRender={(...args: any[]): void =>
                        logger.log({
                          event: Event.REACT_ROUTE_RENDER,
                          type: RainierLogLevel.DEBUG,
                          fields: args,
                        })
                      }
                    >
                      <View />
                    </Profiler>
                  )}
                />
              )
          )}
        </Switch>
      )}
    </PageWrapper>
  </StoreProviders>
);

App.displayName = 'App';
