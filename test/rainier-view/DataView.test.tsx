import React, { FC } from 'react';
import routeData from 'react-router';
import { render, waitFor } from '@testing-library/react';
import { dataView } from 'rainier-view/DataView';
import { initControllerRegistry } from 'rainier-controller/registry';
import { setupStores } from 'rainier-test/store-utils';
import { serverContextStore } from 'rainier-store/server-context-store';
import type { ControllerRegistry } from 'rainier-controller/registry/types';

describe('dataView HOC', () => {
  const View: FC = () => <div>Hello, World!</div>;

  function getControllerRegistryAndFetchMock(
    shouldFetch: boolean
  ): { controllerRegistry: ControllerRegistry; fetchMock: jest.Mock } {
    const fetchMock = jest.fn();
    return {
      controllerRegistry: initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
              fetch: shouldFetch ? fetchMock : undefined,
            },
          ],
        },
      ]),

      fetchMock,
    };
  }

  beforeEach(() => {
    jest.spyOn(routeData, 'useLocation').mockReturnValue({
      pathname: '/todos/show',
      hash: '',
      search: '/todos/show',
      state: '',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.__CLIENT_CONFIG__ = undefined;
  });

  it('does not call fetch method on server render when fetch is defined', () => {
    const { fetchMock, controllerRegistry } = getControllerRegistryAndFetchMock(true);

    const DataView = setupStores(dataView(View, controllerRegistry))
      .with(serverContextStore, {
        isServerLoad: true,
      })
      .provide();

    const { queryByText } = render(<DataView />);

    expect(queryByText('Hello, World!')).not.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not call fetch method on client render when fetch is not defined', async () => {
    const onAfterClientDataFetchMock = jest.fn().mockResolvedValue(undefined);
    window.__CLIENT_CONFIG__ = {
      hooks: {
        onAfterClientDataFetch: onAfterClientDataFetchMock,
      },
    };

    const { controllerRegistry } = getControllerRegistryAndFetchMock(false);

    const DataView = setupStores(dataView(View, controllerRegistry))
      .with(serverContextStore, {
        isServerLoad: false,
      })
      .provide();

    render(<DataView />);

    await waitFor(() => expect(onAfterClientDataFetchMock).not.toHaveBeenCalled());
  });

  it('does call fetch method on client render when fetch is defined', () => {
    const { fetchMock, controllerRegistry } = getControllerRegistryAndFetchMock(true);

    const DataView = setupStores(dataView(View, controllerRegistry))
      .with(serverContextStore, {
        isServerLoad: false,
      })
      .provide();

    const { queryByText } = render(<DataView />);

    expect(queryByText('Hello, World!')).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does call onAfterClientDataFetchMock on client render when fetch is defined and onAfterClientDataFetchMock is defined', async () => {
    const onAfterClientDataFetchMock = jest.fn().mockResolvedValue(undefined);
    window.__CLIENT_CONFIG__ = {
      hooks: {
        onAfterClientDataFetch: onAfterClientDataFetchMock,
      },
    };

    const { controllerRegistry } = getControllerRegistryAndFetchMock(true);

    const DataView = setupStores(dataView(View, controllerRegistry))
      .with(serverContextStore, {
        isServerLoad: false,
      })
      .provide();

    render(<DataView />);

    await waitFor(() => expect(onAfterClientDataFetchMock).toHaveBeenCalledTimes(1));
  });

  it('does call onRouteMatch on client', async () => {
    const onRouteMatchMock = jest.fn().mockResolvedValue(undefined);
    window.__CLIENT_CONFIG__ = {
      hooks: {
        onRouteMatch: onRouteMatchMock,
      },
    };

    const { controllerRegistry } = getControllerRegistryAndFetchMock(false);

    const DataView = setupStores(dataView(View, controllerRegistry))
      .with(serverContextStore, {
        isServerLoad: false,
      })
      .provide();

    render(<DataView />);

    await waitFor(() => expect(onRouteMatchMock).toHaveBeenCalledTimes(1));
  });
});
