import path from 'path';
import { RainierRcTransformer } from './rainier-rc-transformer';
import { exitAndLogIfFieldIsUndefined } from '../exit-and-log-if-field-is-undefined';

export const storesDirTransformer: RainierRcTransformer = (rainierRC) => {
  exitAndLogIfFieldIsUndefined(
    rainierRC.storesDir,
    'required field "storesDir" not found in .rainierrc'
  );

  rainierRC.storesDir = path.join(process.cwd(), rainierRC.storesDir);
  return rainierRC;
};
