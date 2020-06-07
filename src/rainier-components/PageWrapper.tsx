import React, { FunctionComponent, useEffect, StrictMode } from 'react';
import { useStore, ServerContextStore } from 'rainier-store';

const { default: AppShell } = require(__APP_SHELL__);

export const PageWrapper: FunctionComponent = ({ children }) => {
  const serverContextStore = useStore(ServerContextStore);

  useEffect(() => {
    serverContextStore.state.isServerLoad = false;
  }, []);

  return (
    <StrictMode>
      <AppShell>{children}</AppShell>
    </StrictMode>
  );
};
