import { ServerContextStore } from 'rainier-store/server-context-store';
import type { StoreMap } from 'rainier-store/types';

export const initPlatformClientStores = (serializedData: StoreMap): StoreMap => ({
  serverContextStore: new ServerContextStore(serializedData.serverContextStore.state),
});
