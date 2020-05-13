import { RainierRC } from '../rainier-rc';

export interface RainierRcTransformer {
  (rainierRc: RainierRC): string;
}
