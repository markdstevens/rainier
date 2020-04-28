import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { initControllers } from '@rainier/controller';
import { configureClientStores } from './configure-client-stores';
import { App } from '@rainier/components';

const stores = configureClientStores((window as any).__INITIAL_STATE__);
initControllers();

loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <App stores={stores} />
    </BrowserRouter>,
    document.getElementById('app')
  );
});
