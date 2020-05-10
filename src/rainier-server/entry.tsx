import React from 'react';
import path from 'path';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';
import createLocaleMiddleware from 'express-locale';
import { configureServerStores } from './configure-server-stores';
import { fetchInitialRouteData } from './fetch-initial-route-data';
import { ServerContextStore } from '../rainier-store/server-context-store';
import { LocalizationStore } from '../rainier-store/localization-store';
import { controllerRegistry } from '../rainier-controller/controller-registry';
import { initControllers } from '../rainier-controller/init-controllers';
import { logger } from '../rainier-logger/logger';
import { App } from '../rainier-components/App';
import hbs from 'express-hbs';

const statsFile = path.resolve('dist/loadable-stats.json');

const server = express();

server.engine('hbs', hbs.express4());
server.set('view engine', 'hbs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.static('dist'));
server.use(createLocaleMiddleware());

server.get('*', async (req, res) => {
  const extractor = new ChunkExtractor({ statsFile });

  const stores = configureServerStores(req);
  const { state } = stores.get<ServerContextStore>('serverContextStore');

  await stores.get<LocalizationStore>('localizationStore').fetch(state.language, state.region);

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
      },
    },
    inject: false,
  });
});

server.listen(3000, () => logger.info('App listening on port 3000!'));
