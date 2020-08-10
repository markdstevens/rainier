import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';
import type { RainierRC, RainierServerConfig } from '../types';

export class ServerConfiguration extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'server';
  public readonly isRequired = true;
  public readonly defaultConfigValue: RainierServerConfig = {
    dev: {
      httpPort: 8000,
      httpsPort: 8443,
      keyFilePath: './src/rainier-config/server/key.pem',
      certFilePath: './src/rainier-config/server/cert.pem',
    },
    prod: {
      httpPort: 80,
      httpsPort: 443,
      keyFilePath: './src/rainier-config/server/key.pem',
      certFilePath: './src/rainier-config/server/cert.pem',
    },
  };

  static getCertOrKey(configKey: string, defaultConfig: string): string {
    const resolvedPath = path.join(process.cwd(), configKey);

    return fileOrDirExists(resolvedPath, ['pem']) ? resolvedPath : defaultConfig;
  }

  transformConfig(serverConfig: RainierServerConfig): RainierServerConfig {
    const defaultHttpsKey = path.join(__dirname, '../../rainier-server/https/key.pem');
    const defaultHttpsCert = path.join(__dirname, '../../rainier-server/https/cert.pem');

    return {
      dev: {
        ...serverConfig.dev,
        keyFilePath: ServerConfiguration.getCertOrKey(
          serverConfig.dev.keyFilePath,
          defaultHttpsKey
        ),
        certFilePath: ServerConfiguration.getCertOrKey(
          serverConfig.dev.certFilePath,
          defaultHttpsCert
        ),
      },
      prod: {
        ...serverConfig.prod,
        keyFilePath: ServerConfiguration.getCertOrKey(
          serverConfig.prod.keyFilePath,
          defaultHttpsKey
        ),
        certFilePath: ServerConfiguration.getCertOrKey(
          serverConfig.prod.certFilePath,
          defaultHttpsCert
        ),
      },
    };
  }

  isValid(serverConfig: RainierServerConfig): boolean {
    const { dev, prod } = serverConfig;
    if (!dev || !prod) return false;

    if (!dev.httpPort || !dev.httpsPort) return false;
    if (!prod.httpPort || !prod.httpsPort) return false;

    const keyExists = fileOrDirExists(serverConfig.prod.keyFilePath, ['pem']);
    const certExists = fileOrDirExists(serverConfig.prod.certFilePath, ['pem']);

    return keyExists && certExists;
  }
}
