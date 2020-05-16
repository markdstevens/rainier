import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { registerControllers } from '../rainier-controller/register-controllers';
import { configureClientStores } from './configure-client-stores';
import { App } from '../rainier-components/App';
import './css-global-import';

const stores = configureClientStores(window.__INITIAL_STATE__);
registerControllers();

loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <App stores={stores} />
    </BrowserRouter>,
    document.getElementById('app')
  );
});
