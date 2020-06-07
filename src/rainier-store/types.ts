import { Dispatch } from 'react';

export interface IStore<T = any> {
  state: T;
  updateState(prevState: T, nextState: T): T;
  dispatch: Dispatch<T>;
  isPlatformStore?: boolean;
  context: React.Context<T>;
}

export interface StoreMap {
  [key: string]: IStore;
}

export interface Stores {
  stores: StoreMap;
  get<T extends StoreConstructorFunction>(storeName: T): InstanceType<T> | never;
}

export type Reducer<State = any> = [State, Dispatch<State>];

export type StoreConstructorFunction = new (...args: any) => IStore;
