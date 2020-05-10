import React, { FC, StrictMode, useEffect } from 'react';
import { useServerContextStore } from '../rainier-store/server-context-store';

export const PageWrapper: FC = ({ children }) => {
  const [serverContextState] = useServerContextStore();

  useEffect(() => {
    serverContextState.isServerLoad = false;
  }, []);

  return <StrictMode>{children}</StrictMode>;
};
