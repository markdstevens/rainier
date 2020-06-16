import type { RainierRC } from '../types';

export interface RainierRcTransformer {
  (rainierRc: RainierRC): string;
}
