import React, { FC, useEffect, StrictMode } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useStore } from 'rainier-store/useStore';
import { ServerContextStore } from 'rainier-store/server-context-store';
import type { PageWrapperProps } from './types';

const { default: AppShell } = require(__APP_SHELL__);

export const PageWrapper: FC<PageWrapperProps> = ({
  children,
  controllerRegistry,
  htmlTagManager,
}: PageWrapperProps) => {
  const serverContextStore = useStore(ServerContextStore);
  const location = useLocation();

  useEffect(() => {
    if (!serverContextStore.state.isServerLoad) {
      const {
        bodyTags,
        headTags,
        pageTitle,
        noScriptText,
      } = controllerRegistry.findControllerAndRoute(
        location.pathname,
        queryString.parse(location.search)
      ).viewData;

      if (document.title !== pageTitle) {
        document.title = pageTitle;
      }

      const noScriptElement = document.getElementsByTagName('noscript')[0];
      if (noScriptElement && noScriptElement.innerHTML !== noScriptText) {
        noScriptElement.innerHTML = noScriptText;
      }

      htmlTagManager?.appendTagsToDOMIfNotAlreadyPresent(bodyTags, 'body');
      htmlTagManager?.appendTagsToDOMIfNotAlreadyPresent(headTags, 'head');
    } else {
      htmlTagManager?.initTagRegistryWithHtmlTagsFromServerRender(window.__HTML_TAGS__);
    }

    serverContextStore.state.isServerLoad = false;
  }, [location]);

  return (
    <StrictMode>
      <AppShell>{children}</AppShell>
    </StrictMode>
  );
};
