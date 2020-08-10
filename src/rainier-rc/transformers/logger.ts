import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';
import type { RainierRC } from '../types';

export class LoggerConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'logger';
  public readonly defaultConfigValue = './src/logger';
  public readonly isRequired = false;

  transformConfig(loggerFilePath: string): string {
    return path.join(process.cwd(), loggerFilePath);
  }

  isValid(loggerFilePath: string): boolean {
    return fileOrDirExists(loggerFilePath, ['js', 'ts']);
  }
}
