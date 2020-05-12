import React, { FunctionComponent, useEffect, StrictMode } from 'react';
import { useServerContextStore } from '../rainier-store/server-context-store';

export const PageWrapper: FunctionComponent = ({ children }) => {
  const [serverContextState] = useServerContextStore();

  useEffect(() => {
    serverContextState.isServerLoad = false;
  }, []);

  return <StrictMode>{children}</StrictMode>;
};
