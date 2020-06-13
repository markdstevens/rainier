import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { registerControllers } from 'rainier-controller/register-controllers';
import { App } from 'rainier-components/App';
import { configureClientStores } from './configure-client-stores';
import { initClientHooks } from 'rainier-lifecycle/init-hooks';

__CSS_GLOBAL_FILE__ && require(__CSS_GLOBAL_FILE__);

const clientConfig = initClientHooks();
window.__CLIENT_CONFIG__ = clientConfig;

registerControllers();
const stores = configureClientStores(window.__INITIAL_STATE__);

await clientConfig?.hooks?.onAfterStoreInit?.(stores);

loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <App stores={stores} />
    </BrowserRouter>,
    document.getElementById('app')
  );
});
