import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { initControllers } from '../rainier-controller/init-controllers';
import { configureClientStores } from './configure-client-stores';
import { App } from '../rainier-components/App';
import './css-global-import';

const stores = configureClientStores(window.__INITIAL_STATE__);
initControllers();

loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <App stores={stores} />
    </BrowserRouter>,
    document.getElementById('app')
  );
});
