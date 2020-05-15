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
import { initControllers } from '../rainier-controller/init-controllers';
import { logger } from '../rainier-logger/logger';
import { App } from '../rainier-components/App';
import hbs from 'express-hbs';
import { existsSync } from 'fs';

const statsFile = `${process.env.ORIGINAL_DIR}/dist/loadable-stats.json`;
const hasManifest = existsSync(`${process.env.ORIGINAL_DIR}/dist/manifest.json`);

const server = express();

server.engine('hbs', hbs.express4());
server.set('view engine', 'hbs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.static(`${process.env.ORIGINAL_DIR}/dist`));
server.use(createLocaleMiddleware());

server.get('*', async (req, res) => {
  const extractor = new ChunkExtractor({ statsFile });

  const stores = configureServerStores(req);

  initControllers();

  const controllerAction = controllerRegistry.findActionByFullPath(req.path);
  await fetchInitialRouteData(controllerAction, stores, req.path);

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
        hasManifest,
      },
    },
    inject: false,
  });
});

server.listen(3000, () => logger.info('App listening on port 3000!'));
