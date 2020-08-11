import React from 'react';
import path from 'path';
import express from 'express';
import https from 'https';
import http from 'http';
import hbs from 'express-hbs';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';
import { existsSync, readFileSync } from 'fs';
import { useStaticRendering as usingStaticRendering } from 'mobx-react-lite';
import { App } from 'rainier-components/App';
import { toRouteMatchHookParams } from 'rainier-lifecycle/to-route-match-hook-params';
import { initServerHooks } from 'rainier-lifecycle/init-hooks';
import { configureServerStores } from './configure-server-stores';
import { fetchInitialRouteData } from './fetch-initial-route-data';
import { adaptViewDataForServer } from './adapt-view-data-for-server';
import { getControllers } from 'rainier-controller/get-controllers';
import { initControllerRegistry } from 'rainier-controller/registry';
import { wrapStoresWithRetriever } from 'rainier-store/wrap-stores-with-retriever';
import { ServerContextStore } from 'rainier-store/types';
import { Event } from 'rainier-event';
import { RainierLogLevel } from 'rainier-logger/log-level';
import { logger } from 'rainier-logger/logger';
import type { ParsedQuery } from 'query-string';
import type { RainierServerConfigEnv } from 'rainier-rc/types';

const serverConfig: RainierServerConfigEnv = __SERVER_CONFIG__;
const key = readFileSync(serverConfig.keyFilePath);
const cert = readFileSync(serverConfig.certFilePath);
const { httpPort, httpsPort } = serverConfig;

usingStaticRendering(true);

const controllers = getControllers();
const controllerRegistry = initControllerRegistry(controllers);

const statsFile = `${__APP_ROOT__}/dist/loadable-stats.json`;
const hasManifest = existsSync(`${__APP_ROOT__}/dist/manifest.json`);
const hasServiceWorker = existsSync(`${__APP_ROOT__}/dist/service-worker.js`);

const app = express();
const serverHooks = initServerHooks();

app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');
app.set('views', path.join(__RAINIER_ROOT__, 'dist/rainier-server/views'));

hbs.express4({
  beautify: false,
});

app.use('/public', express.static(`${__APP_ROOT__}/dist`));

serverHooks?.middleware?.map((middlewareFunction) => {
  app.use(middlewareFunction);
});

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(`${__APP_ROOT__}/dist/service-worker.js`));
});

app.get('*', async (req, res) => {
  const extractor = new ChunkExtractor({ statsFile });

  const stores = configureServerStores(req);
  const storesWithRetriever = wrapStoresWithRetriever(stores);
  const serverContextStore = storesWithRetriever.get<ServerContextStore>('serverContextStore');
  await serverHooks?.hooks?.onAfterStoreInit?.(stores);

  const controllerMatch = controllerRegistry.findControllerAndRoute(
    req.path,
    req.query as ParsedQuery
  );

  if (controllerMatch.controller) {
    await serverHooks?.hooks?.onRouteMatch?.(toRouteMatchHookParams(controllerMatch));
  }

  await fetchInitialRouteData(controllerMatch, storesWithRetriever, req.path);
  await serverHooks?.hooks?.onAfterServerDataFetch?.(stores);

  const html = renderToString(
    extractor.collectChunks(
      <StaticRouter location={req.url}>
        <App
          stores={stores}
          controllerRegistry={controllerRegistry}
          renderShellOnly={serverContextStore.isAppShellRequest}
        />
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

const httpServer = http.createServer(app);
const httpsServer = https.createServer({ key: key, cert: cert }, app);

httpServer.listen(httpPort, () =>
  logger.log({
    event: Event.APPLICATION_STARTUP,
    type: RainierLogLevel.INFO,
    fields: {
      protocol: 'http',
      port: httpPort,
      startupTime: Date.now(),
      message: `Started http server on port ${httpPort}`,
    },
  })
);

httpsServer.listen(httpsPort, () =>
  logger.log({
    event: Event.APPLICATION_STARTUP,
    type: RainierLogLevel.INFO,
    fields: {
      protocol: 'https',
      port: httpsPort,
      startupTime: Date.now(),
      message: `Started https server on port ${httpsPort}`,
    },
  })
);
