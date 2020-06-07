import { Store } from './store';

export interface ServerContextState {
  location: string;
  language: string;
  region: string;
  locale: string;
  isServerLoad: boolean;
}
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
