import path from 'path';
import { RainierRcTransformer } from './rainier-rc-transformer';
import { exitAndLogIfFieldIsUndefined } from '../exit-and-log-if-field-is-undefined';

export const publicAssetsDirTransformer: RainierRcTransformer = (rainierRC) => {
  exitAndLogIfFieldIsUndefined(
    rainierRC.publicAssetsDir,
    'required field "publicAssetsDir" not found in .rainierrc'
  );

  rainierRC.publicAssetsDir = path.join(process.cwd(), rainierRC.publicAssetsDir);
  return rainierRC;
};
