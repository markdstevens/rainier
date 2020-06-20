import { serverContextStore } from 'rainier-store/server-context-store';
import type { Stores, ServerContextStore } from 'rainier-store/types';
import type { Request } from 'express';

interface ExpressLocale {
  locale: {
    language: string;
    region: string;
  };
}

export function initPlatformStores(request: Request): Stores {
  const req = request as Request & ExpressLocale;
  const serverContextStoreState: ServerContextStore = {
    location: req.path,
    isServerLoad: true,
    setIsServerLoad: (isServerLoad: boolean) => {
      serverContextStoreState.isServerLoad = isServerLoad;
    },
  };

  return {
    serverContextStore: Object.assign({}, serverContextStore(), serverContextStoreState),
  };
}
