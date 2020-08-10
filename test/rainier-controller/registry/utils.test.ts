import { controllerRegistryUtils } from 'rainier-controller/registry';
import type { RegisteredController } from 'rainier-controller/types';

describe('controllerRegistryUtils', () => {
  describe('isHomeController()', () => {
    it('returns true when controller has no base path', () => {
      expect(controllerRegistryUtils.isHomeController(undefined)).toBe(true);
    });

    it('returns true when controller has empty base path', () => {
      expect(controllerRegistryUtils.isHomeController('')).toBe(true);
    });

    it('returns true when controller has root base path', () => {
      expect(controllerRegistryUtils.isHomeController('/')).toBe(true);
    });

    it('returns false when controller has a non-empty, non-root base path', () => {
      expect(controllerRegistryUtils.isHomeController('/todos')).toBe(false);
    });
  });

  describe('isDefaultController()', () => {
    it('returns true when controller has default base path', () => {
      expect(controllerRegistryUtils.isDefaultController('*')).toBe(true);
    });

    it('returns false for every base path that is not the default base path', () => {
      const nonDefaultBasePaths = [
        undefined,
        null,
        '',
        '/',
        '/todos',
        '/todos/show',
        '/:id',
        '**',
        '*/*',
      ];

      nonDefaultBasePaths.forEach((basePath) => {
        expect(controllerRegistryUtils.isDefaultController(basePath as string)).toBe(false);
      });
    });
  });

  describe('getNormalizedBasePath()', () => {
    it('returns home controller path when base path is one of the home controller paths', () => {
      const homeControllerPaths = [undefined, null, '', '/'];

      homeControllerPaths.forEach((path) => {
        expect(controllerRegistryUtils.getNormalizedBasePath(path as string)).toBe('');
      });
    });

    it('returns default controller path when base path is the default path', () => {
      expect(controllerRegistryUtils.getNormalizedBasePath('*')).toBe('*');
    });

    it('returns a path that begins with a "/" if base path is not home or default', () => {
      const nonHomeAndNonDefaultPaths = ['/todos', 'todos'];

      nonHomeAndNonDefaultPaths.forEach((path) => {
        expect(controllerRegistryUtils.getNormalizedBasePath(path)).toMatch(/^\//);
      });
    });
  });

  describe('getNormalizedRoutePaths()', () => {
    it('returns the default route path when no paths are specified', () => {
      [null, undefined].forEach((bottomValue) => {
        const { paths, fullPaths } = controllerRegistryUtils.getNormalizedRoutePaths(
          '/todos',
          bottomValue as undefined
        );

        expect(paths).toHaveLength(1);
        expect(fullPaths).toHaveLength(1);

        expect(paths[0]).toBe('/*');
        expect(fullPaths[0]).toBe('/todos/*');
      });
    });

    it('returns the normalized route paths when paths are specified', () => {
      const { paths, fullPaths } = controllerRegistryUtils.getNormalizedRoutePaths('/todos', [
        '/show/:id/',
        '/',
      ]);

      expect(paths).toHaveLength(2);
      expect(fullPaths).toHaveLength(2);

      expect(paths[0]).toBe('/show/:id');
      expect(fullPaths[0]).toBe('/todos/show/:id');

      expect(paths[1]).toBe('/');
      expect(fullPaths[1]).toBe('/todos/');
    });
  });

  describe('getDefaultController()', () => {
    it('should return undefined if there are no controllers', () => {
      expect(controllerRegistryUtils.getDefaultController([])).toBeUndefined();
    });

    it('should return undefined if no default controller is found', () => {
      const controllers: RegisteredController[] = [
        {
          isDefault: false,
          isHome: true,
          basePath: '/',
          routes: [],
        },
      ];

      expect(controllerRegistryUtils.getDefaultController(controllers)).toBeUndefined();
    });

    it('should return the default controller if one is found', () => {
      const defaultController = {
        isDefault: true,
        isHome: false,
        basePath: '/todos',
        routes: [],
      };

      const nonDefaultController = {
        isDefault: false,
        isHome: true,
        basePath: '/',
        routes: [],
      };

      const controllers: RegisteredController[] = [defaultController, nonDefaultController];

      expect(controllerRegistryUtils.getDefaultController(controllers)).toStrictEqual(
        defaultController
      );
    });
  });

  describe('getHomeController()', () => {
    it('should return undefined if there are no controllers', () => {
      expect(controllerRegistryUtils.getHomeController([])).toBeUndefined();
    });

    it('should return undefined if no home controller is found', () => {
      const controllers: RegisteredController[] = [
        {
          isDefault: true,
          isHome: false,
          basePath: '/todos',
          routes: [],
        },
      ];

      expect(controllerRegistryUtils.getHomeController(controllers)).toBeUndefined();
    });

    it('should return the home controller if one is found', () => {
      const homeController = {
        isDefault: false,
        isHome: true,
        basePath: '/',
        routes: [],
      };

      const nonHomeController = {
        isDefault: false,
        isHome: false,
        basePath: '/todos/show',
        routes: [],
      };

      const controllers: RegisteredController[] = [homeController, nonHomeController];

      expect(controllerRegistryUtils.getHomeController(controllers)).toStrictEqual(homeController);
    });
  });

  describe('getControllerFromPath()', () => {
    const homeController = {
      basePath: '/',
      isDefault: false,
      isHome: true,
      routes: [],
    };

    const defaultController = {
      basePath: '*',
      isDefault: true,
      isHome: false,
      routes: [],
    };

    const todosController = {
      basePath: '/todos',
      isDefault: false,
      isHome: false,
      routes: [],
    };

    it('returns undefined when no controllers are supplied', () => {
      expect(controllerRegistryUtils.getControllerFromPath([], '/todos')).toBeUndefined();
    });

    it('returns undefined when no match is found and no default controller exists', () => {
      const controller = controllerRegistryUtils.getControllerFromPath(
        [homeController, todosController],
        '/does/not/exist'
      );

      expect(controller).toBeUndefined();
    });

    it('returns default controller when no match is found and default controller exists', () => {
      const controller = controllerRegistryUtils.getControllerFromPath(
        [homeController, defaultController, todosController],
        '/does/not/exists'
      );

      expect(controller).toStrictEqual(defaultController);
    });

    it('returns default controller when one exists and path contains no slashes', () => {
      const controller = controllerRegistryUtils.getControllerFromPath(
        [homeController, defaultController, todosController],
        ''
      );

      expect(controller).toStrictEqual(defaultController);
    });

    it('returns home controller when one exists and path is the home path', () => {
      const controller = controllerRegistryUtils.getControllerFromPath(
        [homeController, defaultController, todosController],
        '/about'
      );

      expect(controller).toStrictEqual(homeController);
    });

    it('returns correct controller when one is found that matches the supplied path', () => {
      const controller = controllerRegistryUtils.getControllerFromPath(
        [homeController, defaultController, todosController],
        '/todos/'
      );

      expect(controller).toStrictEqual(todosController);
    });
  });

  describe('getDataForMatchedRoute()', () => {
    const showRoute = {
      paths: ['/show'],
      fullPaths: ['/todos/show'],
      isDefaultRoute: false,
      View: jest.fn(),
    };

    const todosController: RegisteredController = {
      basePath: '/todos',
      isDefault: false,
      isHome: false,
      routes: [showRoute],
    };

    it('returns undefined when there is no supplied controller', () => {
      expect(
        controllerRegistryUtils.getDataForMatchedRoute('/todos/show', {}, undefined)
      ).toBeUndefined();
    });

    it('returns undefined when there is a supplied controller but no match is found', () => {
      const match = controllerRegistryUtils.getDataForMatchedRoute(
        '/todos/doesnotexist',
        {},
        todosController
      );

      expect(match).toBeUndefined();
    });

    it('returns matched route data when there is a supplied controller and a match is found', () => {
      const queryParams = { name: 'foo' };
      const response = controllerRegistryUtils.getDataForMatchedRoute(
        '/todos/show',
        queryParams,
        todosController
      );

      expect(response).toBeDefined();
      expect(response?.route).toStrictEqual(showRoute);
      expect(response?.queryParams).toStrictEqual(queryParams);
      expect(response?.match).toBeDefined();
    });
  });
});
