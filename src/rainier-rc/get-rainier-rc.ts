import { readFileSync } from 'fs';
import { RainierRC } from './rainier-rc';
import {
  PublicAssetsDirConfig,
  ControllerConfiguration,
  StoreConfiguration,
  CssGlobalFileConfig,
  AppShellConfig,
  RainierHooksConfiguration,
} from './transformers';

export const getRainierRc = (): RainierRC => {
  const cwd = process.cwd();
  const rainierRC = `${cwd}/.rainierrc`;

  let rainierConfigBuffer: Buffer | null;
  let rainierConfig = {} as RainierRC;

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

  [
    PublicAssetsDirConfig,
    ControllerConfiguration,
    StoreConfiguration,
    CssGlobalFileConfig,
    AppShellConfig,
    RainierHooksConfiguration,
  ]
    .map((Config) => new Config(rainierConfig))
    .map(({ configName, getOrDefault, validate }) => ({
      configName,
      configValue: getOrDefault(),
      validate,
    }))
    .filter(({ validate, configValue }) => validate(configValue))
    .forEach(({ configName, configValue }) => {
      (rainierConfig[configName] as typeof configValue) = configValue;
    });

  return rainierConfig as RainierRC;
};
