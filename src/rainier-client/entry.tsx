import React from 'react';
import { hydrate, render, Renderer } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { App } from 'rainier-components/App';
import { initClientHooks } from 'rainier-lifecycle/init-hooks';
import { getControllers } from 'rainier-controller/get-controllers';
import { initControllerRegistry } from 'rainier-controller/registry';
import { initHtmlTagManager } from 'rainier-view/html-tag-manager';
import { configureClientStores } from './configure-client-stores';
import { wrapStoresWithRetriever } from 'rainier-store/wrap-stores-with-retriever';
import 'mobx-react-lite/batchingForReactDom';
import type { Stores, ServerContextStore } from 'rainier-store/types';

__CSS_GLOBAL_FILE__ && require(__CSS_GLOBAL_FILE__);

const clientConfig = initClientHooks();
window.__CLIENT_CONFIG__ = clientConfig;

const controllerRegistry = initControllerRegistry(getControllers());
const htmlTagManager = initHtmlTagManager();

(async function (): Promise<{ stores: Stores; renderer: Renderer; rendererName: string }> {
  const stores = configureClientStores(window.__INITIAL_STATE__);
  await clientConfig?.hooks?.onAfterStoreInit?.(stores);

  const storesWithRetriever = wrapStoresWithRetriever(stores);
  const serverContextStore = storesWithRetriever.get<ServerContextStore>('serverContextStore');
  const { isAppShellRequest } = serverContextStore;

  return {
    stores,
    renderer: isAppShellRequest ? render : hydrate,
    rendererName: isAppShellRequest ? 'render' : 'hydrate',
  };
})().then(({ stores, renderer, rendererName }) => {
  console.log(`using renderer: ${rendererName}`);
  loadableReady(() => {
    renderer(
      <BrowserRouter>
        <App
          stores={stores}
          controllerRegistry={controllerRegistry}
          htmlTagManager={htmlTagManager}
          renderShellOnly={false}
        />
      </BrowserRouter>,
      document.getElementById('app')
    );
  });
});
