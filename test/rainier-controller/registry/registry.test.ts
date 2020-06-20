import { initControllerRegistry } from 'rainier-controller/registry';
import type { Controller } from 'rainier-controller/types';

describe('controller registry', () => {
  describe('getReactRouterControllerData()', () => {
    const defaultController: Controller = {
      basePath: '*',
      routes: [
        {
          paths: ['/blah'],
          View: jest.fn(),
        },
        {
          paths: ['*'],
          View: jest.fn(),
        },
      ],
    };

    const todosController: Controller = {
      basePath: '/todos',
      routes: [
        {
          paths: ['/show'],
          View: jest.fn(),
        },
      ],
    };

    it('returns an empty list when no controllers are registered', () => {
      const controllerRegistry = initControllerRegistry(undefined);

      expect(controllerRegistry.getReactRouterControllerData()).toHaveLength(0);
    });

    it('returns an empty list when controller is registered but there are no routes', () => {
      const controllerRegistry = initControllerRegistry([{ basePath: '/blah' }]);

      expect(controllerRegistry.getReactRouterControllerData()).toHaveLength(0);
    });

    it('returns default controller routes when the default controller exists', () => {
      const controllerRegistry = initControllerRegistry([defaultController]);
      const routeData = controllerRegistry.getReactRouterControllerData();

      expect(routeData).toHaveLength(2);
      expect(routeData[0].View).toBe(defaultController.routes?.[0].View);
      expect(routeData[0].fullPath).toBe('*/blah');

      expect(routeData[1].View).toBe(defaultController.routes?.[1].View);
      expect(routeData[1].fullPath).toBe('*/*');
    });

    it('returns default controller data last when other controllers are present', () => {
      const controllerRegistry = initControllerRegistry([todosController, defaultController]);
      const routeData = controllerRegistry.getReactRouterControllerData();

      expect(routeData).toHaveLength(3);

      expect(routeData[0].View).toBe(todosController.routes?.[0].View);
      expect(routeData[0].fullPath).toBe('/todos/show');

      expect(routeData[1].View).toBe(defaultController.routes?.[0].View);
      expect(routeData[1].fullPath).toBe('*/blah');

      expect(routeData[2].View).toBe(defaultController.routes?.[1].View);
      expect(routeData[2].fullPath).toBe('*/*');
    });

    it('returns default route last when one exists', () => {
      const defaultRouteView = jest.fn();
      const nonDefaultRouteView = jest.fn();
      const testController: Controller = {
        basePath: '/todos',
        routes: [
          {
            View: defaultRouteView,
          },
          {
            paths: ['/show'],
            View: nonDefaultRouteView,
          },
        ],
      };
      const controllerRegistry = initControllerRegistry([testController]);
      const routeData = controllerRegistry.getReactRouterControllerData();

      expect(routeData).toHaveLength(2);

      expect(routeData[0].View).toBe(nonDefaultRouteView);
      expect(routeData[0].fullPath).toBe('/todos/show');

      expect(routeData[1].View).toBe(defaultRouteView);
      expect(routeData[1].fullPath).toBe('/todos/*');
    });

    it('correctly returns controller data when no default controller is present', () => {
      const controllerRegistry = initControllerRegistry([todosController]);
      const routeData = controllerRegistry.getReactRouterControllerData();

      expect(routeData).toHaveLength(1);

      expect(routeData[0].View).toBe(todosController.routes?.[0].View);
      expect(routeData[0].fullPath).toBe('/todos/show');
    });

    it('correctly returns dataView View when route has fetch function', () => {
      const todosControllerWithFetch: Controller = {
        basePath: '/todos',
        routes: [
          {
            paths: ['/show'],
            View: jest.fn(),
            fetch: jest.fn(),
          },
        ],
      };

      const controllerRegistry = initControllerRegistry([todosControllerWithFetch]);
      const routeData = controllerRegistry.getReactRouterControllerData();

      expect(routeData).toHaveLength(1);

      expect(routeData[0].View).not.toBe(todosControllerWithFetch.routes?.[0].View);
      expect(routeData[0].fullPath).toBe('/todos/show');
    });
  });

  describe('findControllerAndRoute()', () => {
    const defaultViewData = {
      pageTitle: '',
      noScriptText: '',
      headTags: [],
      bodyTags: [],
    };

    it('returns default response when no controller/route match is found', () => {
      const controllerRegistry = initControllerRegistry([]);
      const response = controllerRegistry.findControllerAndRoute('/does/not/exist', {});

      expect(response).toStrictEqual({
        controller: undefined,
        fetch: undefined,
        pathParams: {},
        queryParams: {},
        viewData: defaultViewData,
      });
    });

    it('returns fetch method if match is found and route has fetch method', () => {
      const fetchFunction = jest.fn();
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              fetch: fetchFunction,
              View: jest.fn(),
            },
          ],
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show', {});

      expect(response.fetch).toBe(fetchFunction);
    });

    it('returns undefined for fetch method if match is found and route has no fetch method', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
            },
          ],
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show', {});

      expect(response.fetch).toBeUndefined();
    });

    it('returns valid pathParams when match is found and path params are present', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show/:id'],
              View: jest.fn(),
            },
          ],
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show/10', {});

      expect(response.pathParams).toStrictEqual({
        id: '10',
      });
    });

    it('returns empty object for pathParams when match is found and no path params are present', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
            },
          ],
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show', {});

      expect(response.pathParams).toStrictEqual({});
    });

    it('returns query params object for queryParams when match is found and query params are present', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
            },
          ],
        },
      ]);

      const queryParams = {
        name: 'mark',
        age: '25',
      };

      const response = controllerRegistry.findControllerAndRoute('/todos/show', queryParams);

      expect(response.queryParams).toStrictEqual(queryParams);
    });

    it('returns empty object for queryParams when match is found and no query params are present', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
            },
          ],
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show', {});

      expect(response.queryParams).toStrictEqual({});
    });

    it('returns empty object for viewData when controller and route have no view data', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
            },
          ],
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show', {});

      expect(response.viewData).toStrictEqual(defaultViewData);
    });

    it('returns route viewData when controller has no viewData but route has viewData', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
              viewData: {
                pageTitle: 'foo',
              },
            },
          ],
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show', {});

      expect(response.viewData.pageTitle).toBe('foo');
    });

    it('returns controller override for viewData field when controller has field but route does not', () => {
      const controllerRegistry = initControllerRegistry([
        {
          basePath: '/todos',
          routes: [
            {
              paths: ['/show'],
              View: jest.fn(),
              viewData: {
                pageTitle: 'foo',
              },
            },
          ],
          viewData: {
            noScriptText: 'bar',
          },
        },
      ]);

      const response = controllerRegistry.findControllerAndRoute('/todos/show', {});

      expect(response.viewData.pageTitle).toBe('foo');
      expect(response.viewData.noScriptText).toBe('bar');
    });

    it("correctly matches the root route when one exists, the URL is the controller's base path, and a home controller exists", () => {
      const homeController: Controller = {
        basePath: '/',
      };

      const testController: Controller = {
        basePath: '/todos',
        routes: [
          {
            paths: ['/'],
            View: jest.fn(),
            fetch: jest.fn(),
          },
          {
            paths: ['/show'],
            View: jest.fn(),
          },
        ],
      };

      const controllerRegistry = initControllerRegistry([homeController, testController]);
      const routeData = controllerRegistry.findControllerAndRoute('/todos', {});

      expect(routeData.fetch).toBeDefined();
    });

    it("correctly matches the home controller when one exists, the URL is the controller's base path, and no regular controller route matches", () => {
      const homeController: Controller = {
        basePath: '/',
        routes: [
          {
            paths: ['/todos'],
            View: jest.fn(),
          },
        ],
      };

      const testController: Controller = {
        basePath: '/todos',
        routes: [
          {
            View: jest.fn(),
            fetch: jest.fn(),
          },
          {
            paths: ['/show'],
            View: jest.fn(),
          },
        ],
      };

      const controllerRegistry = initControllerRegistry([homeController, testController]);
      const routeData = controllerRegistry.findControllerAndRoute('/todos', {});

      expect(routeData.fetch).toBe(homeController.routes?.[0].fetch);
    });
  });
});
