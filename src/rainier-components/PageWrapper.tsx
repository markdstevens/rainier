import React, { FunctionComponent, useEffect, StrictMode } from 'react';
import { useServerContextStore } from '../rainier-store/server-context-store';
import { AppShellWrapper } from './app-shell';

export const PageWrapper: FunctionComponent = ({ children }) => {
  const [serverContextState] = useServerContextStore();

  useEffect(() => {
    serverContextState.isServerLoad = false;
  }, []);

  return (
    <StrictMode>
      <AppShellWrapper>{children}</AppShellWrapper>
    </StrictMode>
  );
};
