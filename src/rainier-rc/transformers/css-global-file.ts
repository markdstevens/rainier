import path from 'path';
import { RainierRcTransformer } from './rainier-rc-transformer';
import { exitAndLogIfFieldIsUndefined } from '../exit-and-log-if-field-is-undefined';

export const cssGlobalFileTransformer: RainierRcTransformer = (rainierRC) => {
  exitAndLogIfFieldIsUndefined(
    rainierRC.cssGlobalFile,
    'required field "cssGlobalFile" not found in .rainierrc'
  );

  rainierRC.cssGlobalFile = path.join(process.cwd(), rainierRC.cssGlobalFile);
  return rainierRC;
};
