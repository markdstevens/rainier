import type { ServerContextStore, Store } from './types';

/**
 * A simple store that contains basic information about the original
 * server request.
 */
export function serverContextStore(): Store<ServerContextStore> {
  const store = {
    location: '',
    language: '',
    region: '',
    locale: '',
    isServerLoad: true,
    todos: [],

    setIsServerLoad(isServerLoad: boolean): void {
      this.isServerLoad = isServerLoad;
    },
  };

  return store;
}
