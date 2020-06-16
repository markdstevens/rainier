import { Store } from './store';
import type { ServerContextState } from './types';

/**
 * A simple store that contains basic information about the original
 * server request.
 */
export class ServerContextStore extends Store<ServerContextState> {
  public isPlatformStore = true;

  public async fetch(): Promise<void> {
    return Promise.resolve();
  }
}
