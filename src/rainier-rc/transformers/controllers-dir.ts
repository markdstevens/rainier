import path from 'path';
import { RainierRcTransformer } from './rainier-rc-transformer';
import { exitAndLogIfFieldIsUndefined } from '../exit-and-log-if-field-is-undefined';

export const controllersDirTransformer: RainierRcTransformer = (rainierRC) => {
  exitAndLogIfFieldIsUndefined(
    rainierRC.controllersDir,
    'required field "controllersDir" not found in .rainierrc'
  );

  rainierRC.controllersDir = path.join(process.cwd(), rainierRC.controllersDir);
  return rainierRC;
};
