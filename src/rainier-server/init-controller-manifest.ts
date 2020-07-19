import { writeFileSync, readFileSync, existsSync } from 'fs';
import { controllerRegistryUtils } from 'rainier-controller/registry';
import type { Controller } from 'rainier-controller/types';

interface ControllerManifest {
  [key: string]: string[];
  statefulRoutes: string[];
  statelessRoutes: string[];
}

export function initControllerManifest(controllers: Controller[]): void {
  const serviceWorkerFilePath = `${__WEBPACK_OUTDIR__}/service-worker.js`;
  const controllerManifest: ControllerManifest = {
    statefulRoutes: [],
    statelessRoutes: [],
  };

  try {
    controllers.forEach((controller) => {
      const normalizedBasePath = controllerRegistryUtils.getNormalizedBasePath(controller.basePath);

      controller.routes?.forEach(({ paths }) => {
        const { fullPaths } = controllerRegistryUtils.getNormalizedRoutePaths(
          normalizedBasePath,
          paths
        );

        fullPaths.forEach((path) => {
          const normalizedPath = path.replace(/\*/g, '(.*)');
          if (path.includes('*') || path.includes('/:')) {
            controllerManifest.statefulRoutes.push(normalizedPath);
          } else {
            controllerManifest.statelessRoutes.push(normalizedPath);
          }
        });
      });
    });
  } catch (e) {
    console.log(e);
  }

  if (existsSync(serviceWorkerFilePath)) {
    const injectedManifest = `__RAINIER_CONTROLLER_MANIFEST__ = ${JSON.stringify(
      controllerManifest
    )};`;

    const serviceWorkerFileContents = readFileSync(serviceWorkerFilePath).toString('UTF-8');
    writeFileSync(serviceWorkerFilePath, injectedManifest + serviceWorkerFileContents);
  }
}
