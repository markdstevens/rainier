import type { IStore } from './types';

export type StoreConstructorFunction<T = any> = {
  new (...args: any): IStore<T>;
  getDefaultState?: () => T;
};
