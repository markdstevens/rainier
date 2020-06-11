import React from 'react';
import path from 'path';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';
import createLocaleMiddleware from 'express-locale';
import { configureServerStores } from './configure-server-stores';
import { fetchInitialRouteData } from './fetch-initial-route-data';
import { controllerRegistry } from 'rainier-controller/controller-registry';
import { registerControllers } from 'rainier-controller/register-controllers';
import { logger } from 'rainier-logger/logger';
import { App } from 'rainier-components/App';
import hbs from 'express-hbs';
import { existsSync } from 'fs';
import { initServerHooks } from 'rainier-lifecycle/init-hooks';
import { ParsedQuery } from 'query-string';
import { toRouteMatchParams } from 'rainier-lifecycle/on-route-match';
import { buildHtmlTag } from 'rainier-controller/build-html-tag';

registerControllers();

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
    await serverHooks?.hooks?.onRouteMatch?.(toRouteMatchParams(controllerMatch));
  }

  await fetchInitialRouteData(controllerMatch, stores, req.path);
  await serverHooks?.hooks?.onAfterServerDataFetch?.(stores);

  const html = renderToString(
    extractor.collectChunks(
      <StaticRouter location={req.url}>
        <App stores={stores} />
      </StaticRouter>
    )
  );

  const [linkTags, styleTags, scriptTags] = [
    extractor.getLinkTags(),
    extractor.getStyleTags(),
    extractor.getScriptTags(),
  ];

  const { pageTitle, noScriptText, bodyTags, headTags } = controllerMatch.viewData;

  await serverHooks?.hooks?.onBeforeServerRender?.();
  res.render('index', {
    stores: JSON.stringify(stores, (key, value) => (key === 'context' ? undefined : value)) || '',
    htmlWebpackPlugin: {
      options: {
        title: pageTitle,
        noScriptText,
        isDev: __DEV__,
        bodyTags:
          scriptTags +
          '\n' +
          bodyTags
            .map((tag) => buildHtmlTag(tag))
            .join('\n')
            .trim(),
        headTags:
          linkTags +
          styleTags +
          '\n' +
          headTags
            .map((tag) => buildHtmlTag(tag))
            .join('\n')
            .trim(),
        html,
        includeServiceWorker: !__DEV__ && hasServiceWorker,
        hasManifest,
        htmlTags: JSON.stringify({
          headTags,
          bodyTags,
        }),
      },
    },
    inject: false,
  });
});

server.listen(3000, () => logger.info('App listening on port 3000!'));
