import React, { FunctionComponent, useEffect, StrictMode } from 'react';
import { useStore, ServerContextStore } from 'rainier-store';
import { controllerRegistry } from 'rainier-controller/controller-registry';
import { useLocation } from 'react-router-dom';
import { getViewDataFromControllerMatch } from 'rainier-view/view-data-retriever';
import {
  initTagRegistryWithHtmlTagsFromServerRender,
  appendTagsToDOMIfNotAlreadyPresent,
} from 'rainier-view/html-tag-manager';

const { default: AppShell } = require(__APP_SHELL__);

export const PageWrapper: FunctionComponent = ({ children }) => {
  const serverContextStore = useStore(ServerContextStore);
  const location = useLocation();

  useEffect(() => {
    if (!serverContextStore.state.isServerLoad) {
      const { bodyTags, headTags, pageTitle, noScriptText } = getViewDataFromControllerMatch(
        controllerRegistry.findControllerAndRoute(location.pathname)
      );

      if (document.title !== pageTitle) {
        document.title = pageTitle;
      }

      const noScriptElement = document.getElementsByTagName('noscript')[0];
      if (noScriptElement && noScriptElement.innerHTML !== noScriptText) {
        noScriptElement.innerHTML = noScriptText;
      }

      appendTagsToDOMIfNotAlreadyPresent(bodyTags, 'body');
      appendTagsToDOMIfNotAlreadyPresent(headTags, 'head');
    } else {
      initTagRegistryWithHtmlTagsFromServerRender(window.__HTML_TAGS__);
    }

    serverContextStore.state.isServerLoad = false;
  }, [location]);

  return (
    <StrictMode>
      <AppShell>{children}</AppShell>
    </StrictMode>
  );
};
