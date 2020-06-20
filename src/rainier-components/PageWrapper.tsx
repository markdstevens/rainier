import React, { FC, useEffect, StrictMode } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useStore } from 'rainier-store/useStore';
import type { ServerContextStore } from 'rainier-store/types';
import type { PageWrapperProps } from './types';

const { default: AppShell } = require(__APP_SHELL__);

export const PageWrapper: FC<PageWrapperProps> = ({
  children,
  controllerRegistry,
  htmlTagManager,
}: PageWrapperProps) => {
  let serverContextStore = useStore<ServerContextStore>('serverContextStore');
  if (true) {
    serverContextStore = useStore<ServerContextStore>('serverContextStore');
  }
  const location = useLocation();

  useEffect(() => {
    if (!serverContextStore.isServerLoad) {
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
      serverContextStore.setIsServerLoad(false);
    }
  }, [location]);

  return (
    <StrictMode>
      <AppShell>{children}</AppShell>
    </StrictMode>
  );
};
