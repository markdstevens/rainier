import React from 'react';
import { IStore } from './types';
import { bindProxyHandler } from 'rainier-util';

/**
 * This is the base class that all other stores must extend from.
 * This class is what provides reactivity to the stores' state
 * objects. Nothing in this class or exposed by this super class
 * should be touched in any way. All details of this super class
 * should be considered internals of the rainier framework.
 */
export abstract class Store<T> implements IStore<T> {
  public isPlatformStore = false;
  public context = React.createContext({} as T);

  public state: T;
  private getProxy: (state: T) => T;

  constructor(initialState: T, defaultState: T | {} = {}) {
    this.getProxy = bindProxyHandler((newState: T) => this.dispatch(newState));

    this.state = this.getProxy(Object.assign({}, defaultState, initialState));

    this.updateState = this.updateState.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  public updateState(prevState: T, nextState: T): T {
    this.state = this.getProxy(Object.assign({}, prevState, nextState));
    return this.state;
  }

  public dispatch(newState: T): void {
    /* is overriden in StoreProviders.tsx  */
  }
}
