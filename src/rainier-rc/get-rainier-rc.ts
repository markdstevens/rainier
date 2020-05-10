import { existsSync, readFileSync } from 'fs';
import { RainierRC } from './rainier-rc';
import {
  publicAssetsDirTransformer,
  controllersDirTransformer,
  storesDirTransformer,
  cssGlobalFileTransformer,
  i18nDirTransformer,
} from './transformers';

export const getRainierRc = (): RainierRC => {
  const cwd = process.cwd();
  const rainierRC = `${cwd}/.rainierrc`;

  if (!existsSync(rainierRC)) {
    throw new Error(`no .rainierrc found in ${rainierRC}`);
  }

  let rainierConfig;
  try {
    rainierConfig = readFileSync(rainierRC);
  } catch (e) {
    throw new Error(`failed to read .rainierrc at "${rainierRC}"` + e);
  }

  try {
    rainierConfig = JSON.parse(rainierConfig.toString('UTF-8')) as RainierRC;
  } catch (e) {
    throw new Error('failed to convert .rainierrc to JSON' + e);
  }

  rainierConfig = publicAssetsDirTransformer(rainierConfig);
  rainierConfig = controllersDirTransformer(rainierConfig);
  rainierConfig = storesDirTransformer(rainierConfig);
  rainierConfig = cssGlobalFileTransformer(rainierConfig);
  rainierConfig = i18nDirTransformer(rainierConfig);

  return rainierConfig;
};
