import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { App } from 'rainier-components/App';
import { initClientHooks } from 'rainier-lifecycle/init-hooks';
import { getControllers } from 'rainier-controller/get-controllers';
import { initControllerRegistry } from 'rainier-controller/registry';
import { initHtmlTagManager } from 'rainier-view/html-tag-manager';
import { configureClientStores } from './configure-client-stores';
import type { Stores } from 'rainier-store/types';

__CSS_GLOBAL_FILE__ && require(__CSS_GLOBAL_FILE__);

const clientConfig = initClientHooks();
window.__CLIENT_CONFIG__ = clientConfig;

const controllerRegistry = initControllerRegistry(getControllers());
const htmlTagManager = initHtmlTagManager();

(async function initClientStores(): Promise<Stores> {
  const stores = configureClientStores(window.__INITIAL_STATE__);
  await clientConfig?.hooks?.onAfterStoreInit?.(stores);
  return stores;
})().then((stores) => {
  loadableReady(() => {
    hydrate(
      <BrowserRouter>
        <App
          stores={stores}
          controllerRegistry={controllerRegistry}
          htmlTagManager={htmlTagManager}
        />
      </BrowserRouter>,
      document.getElementById('app')
    );
  });
});
