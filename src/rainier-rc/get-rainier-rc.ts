import { readFileSync } from 'fs';
import { RainierRC } from './rainier-rc';
import {
  PublicAssetsDirConfig,
  ControllersDirConfig,
  StoresDirConfig,
  CssGlobalFileConfig,
} from './transformers';

export const getRainierRc = (): RainierRC => {
  const cwd = process.cwd();
  const rainierRC = `${cwd}/.rainierrc`;

  let rainierConfigBuffer: Buffer | null;
  let rainierConfig: RainierRC | { [key: string]: string } = {};

  try {
    rainierConfigBuffer = readFileSync(rainierRC);
  } catch (e) {
    rainierConfigBuffer = null;
  }

  if (rainierConfigBuffer) {
    try {
      rainierConfig = JSON.parse(rainierConfigBuffer.toString('UTF-8')) as RainierRC;
    } catch (e) {
      throw new Error('failed to convert .rainierrc to JSON' + e);
    }
  }

  [PublicAssetsDirConfig, ControllersDirConfig, StoresDirConfig, CssGlobalFileConfig]
    .map((Config) => new Config(rainierConfig))
    .map(({ configName, getOrDefault, validate }) => ({
      configName,
      configValue: getOrDefault(),
      validate,
    }))
    .forEach(({ configName, configValue, validate }) => {
      validate(configValue);
      rainierConfig[configName] = configValue;
    });

  return rainierConfig as RainierRC;
};
