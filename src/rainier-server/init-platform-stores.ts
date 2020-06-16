import { ServerContextStore } from 'rainier-store/server-context-store';
import type { StoreMap, ServerContextState } from 'rainier-store/types';
import type { Request } from 'express';

interface ExpressLocale {
  locale: {
    language: string;
    region: string;
  };
}

export function initPlatformStores(request: Request): StoreMap {
  const req = request as Request & ExpressLocale;
  const serverContextStoreState: ServerContextState = {
    location: req.path,
    language: req.locale.language,
    region: req.locale.region,
    locale: `${req.locale.language}-${req.locale.region}`,
    isServerLoad: true,
  };

  return {
    serverContextStore: new ServerContextStore({ ...serverContextStoreState }),
  };
}
