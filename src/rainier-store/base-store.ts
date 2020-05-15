import autoBind from 'auto-bind';
import { Store } from './types';
import { bindProxyHandler } from '../rainier-util';

export abstract class BaseStore<T> implements Store<T> {
  public state: T;
  private getProxy: (state: T) => T;

  constructor(initialState: T, defaultState: T | {} = {}) {
    autoBind(this);
    this.getProxy = bindProxyHandler((newState: T) => this.dispatch(newState));

    this.state = this.getProxy(Object.assign({}, defaultState, initialState));
  }

  public updateState(prevState: T, nextState: T): T {
    this.state = this.getProxy(Object.assign({}, prevState, nextState));
    return this.state;
  }

  public dispatch(newState: T): void {
    /* is overriden in StoreProviders.tsx  */
  }
}
