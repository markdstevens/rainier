import path from 'path';
import { RainierRcTransformer } from './rainier-rc-transformer';
import { exitAndLogIfFieldIsUndefined } from '../exit-and-log-if-field-is-undefined';

export const i18nDirTransformer: RainierRcTransformer = (rainierRC) => {
  exitAndLogIfFieldIsUndefined(
    rainierRC.i18nDir,
    'required field "i18nDir" not found in .rainierrc'
  );

  rainierRC.i18nDir = path.join(process.cwd(), rainierRC.i18nDir);
  return rainierRC;
};
