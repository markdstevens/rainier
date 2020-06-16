import React from 'react';
import path from 'path';
import express from 'express';
import createLocaleMiddleware from 'express-locale';
import hbs from 'express-hbs';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';
import { existsSync } from 'fs';
import { initControllerRegistry } from 'rainier-controller/registry';
import { logger } from 'rainier-logger/logger';
import { App } from 'rainier-components/App';
import { toRouteMatchHookParams } from 'rainier-lifecycle/to-route-match-hook-params';
import { initServerHooks } from 'rainier-lifecycle/init-hooks';
import { configureServerStores } from './configure-server-stores';
import { fetchInitialRouteData } from './fetch-initial-route-data';
import { adaptViewDataForServer } from './adapt-view-data-for-server';
import { getControllers } from 'rainier-controller/get-controllers';
import type { ParsedQuery } from 'query-string';

const controllerRegistry = initControllerRegistry(getControllers());

const statsFile = `${__APP_ROOT__}/dist/loadable-stats.json`;
const hasManifest = existsSync(`${__APP_ROOT__}/dist/manifest.json`);
const hasServiceWorker = existsSync(`${__APP_ROOT__}/dist/service-worker.js`);

const server = express();
const serverHooks = initServerHooks();

server.engine('hbs', hbs.express4());
server.set('view engine', 'hbs');
server.set('views', path.join(__RAINIER_ROOT__, 'dist/rainier-server/views'));

server.use('/public', express.static(`${__APP_ROOT__}/dist`));
server.use(createLocaleMiddleware());

serverHooks?.middleware?.map((middlewareFunction) => {
  server.use(middlewareFunction);
});

server.get('*', async (req, res) => {
  const extractor = new ChunkExtractor({ statsFile });

  const stores = configureServerStores(req);
  await serverHooks?.hooks?.onAfterStoreInit?.(stores);

  const controllerMatch = controllerRegistry.findControllerAndRoute(
    req.path,
    req.query as ParsedQuery
  );

  if (controllerMatch.controller) {
    await serverHooks?.hooks?.onRouteMatch?.(toRouteMatchHookParams(controllerMatch));
  }

  await fetchInitialRouteData(controllerMatch, stores, req.path);
  await serverHooks?.hooks?.onAfterServerDataFetch?.(stores);

  const html = renderToString(
    extractor.collectChunks(
      <StaticRouter location={req.url}>
        <App stores={stores} controllerRegistry={controllerRegistry} />
      </StaticRouter>
    )
  );

  await serverHooks?.hooks?.onBeforeServerRender?.();

  res.render('index', {
    stores: JSON.stringify(stores),
    viewData: adaptViewDataForServer(controllerMatch.viewData, extractor),
    isDev: __DEV__,
    html,
    includeServiceWorker: !__DEV__ && hasServiceWorker,
    hasManifest,
  });
});

server.listen(3000, () => logger.info('App listening on port 3000!'));
