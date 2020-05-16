import React from 'react';
import path from 'path';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';
import createLocaleMiddleware from 'express-locale';
import { configureServerStores } from './configure-server-stores';
import { fetchInitialRouteData } from './fetch-initial-route-data';
import { controllerRegistry } from '../rainier-controller/controller-registry';
import { registerControllers } from '../rainier-controller/register-controllers';
import { logger } from '../rainier-logger/logger';
import { App } from '../rainier-components/App';
import hbs from 'express-hbs';
import { existsSync } from 'fs';

const statsFile = `${__APP_ROOT__}/dist/loadable-stats.json`;
const hasManifest = existsSync(`${__APP_ROOT__}/dist/manifest.json`);
const hasServiceWorker = existsSync(`${__APP_ROOT__}/dist/service-worker.js`);

const server = express();

server.engine('hbs', hbs.express4());
server.set('view engine', 'hbs');
server.set('views', path.join(__RAINIER_ROOT__, 'src/rainier-server/views'));

server.use(express.static(`${__APP_ROOT__}/dist`));
server.use(createLocaleMiddleware());

server.get('*', async (req, res) => {
  console.log(req.url);
  const extractor = new ChunkExtractor({ statsFile });

  const stores = configureServerStores(req);

  registerControllers();

  const controllerAndAction = controllerRegistry.findControllerAndAction(req.path);

  const data = await fetchInitialRouteData(controllerAndAction, stores, req.path);

  console.log(data);

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

  if (!data) {
    res.render('index', {
      stores: JSON.stringify(stores) || '',
      htmlWebpackPlugin: {
        options: {
          title: 'React App',
          isDev: __DEV__,
          scriptTags,
          linkTags,
          styleTags,
          html,
          includeServiceWorker: __DEV__ && hasServiceWorker,
          hasManifest,
        },
      },
      inject: false,
    });
  } else {
    res.send(data);
  }
});

server.listen(3000, () => logger.info('App listening on port 3000!'));
