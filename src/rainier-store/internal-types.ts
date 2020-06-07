import { IStore } from './types';

export type StoreConstructorFunction = new (...args: any) => IStore;
