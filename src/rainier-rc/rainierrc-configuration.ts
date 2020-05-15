import { RainierRC } from './rainier-rc';
import autoBind from 'auto-bind';
import { logger } from '../rainier-logger/logger';

export abstract class RainierRCConfiguration {
  abstract readonly configName: keyof RainierRC;
  abstract readonly defaultConfigValue: string;
  abstract readonly isRequired: boolean;
  abstract transformConfig(configValue: string): string;
  abstract isValid(configValue: string): boolean;

  private rainierRc: RainierRC | { [key: string]: string };

  constructor(rainierRc: RainierRC | {}) {
    this.rainierRc = rainierRc;
    autoBind(this);
  }

  validate(configValue: string): void | never {
    if (!this.isValid(configValue) && this.isRequired) {
      logger.terminalError(
        `no valid "${this.configName}" configuration found in .rainierrc. The default of "${this.defaultConfigValue}" was tried but is invalid or does not exist.`
      );
    }
  }

  getOrDefault(): string {
    return this.rainierRc
      ? this.rainierRc[this.configName]
        ? this.transformConfig(this.rainierRc[this.configName])
        : this.transformConfig(this.defaultConfigValue)
      : this.transformConfig(this.defaultConfigValue);
  }
}
