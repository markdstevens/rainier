import { RainierRC } from './rainier-rc';
import chalk from 'chalk';

type RainierRCValues = RainierRC[keyof RainierRC];

export abstract class RainierRCConfiguration {
  abstract readonly configName: keyof RainierRC;
  abstract readonly defaultConfigValue: RainierRCValues;
  abstract readonly isRequired: boolean;
  abstract transformConfig(configValue: RainierRCValues): RainierRCValues;
  abstract isValid(configValue: RainierRCValues): boolean;

  private rainierRc: RainierRC;

  public isValidConfig = true;

  constructor(rainierRc: RainierRC | {}) {
    this.rainierRc = rainierRc as RainierRC;

    this.validate = this.validate.bind(this);
    this.getOrDefault = this.getOrDefault.bind(this);
  }

  validate(configValue: RainierRCValues): boolean | never {
    if (!this.isValid(configValue)) {
      if (this.isRequired) {
        console.error(
          chalk.red(
            `no valid "${
              this.configName
            }" configuration found in .rainierrc. The default of "${JSON.stringify(
              this.defaultConfigValue
            )}" was tried but is invalid or does not exist.\n`
          )
        );
        process.exit(1);
      } else {
        return false;
      }
    }

    return true;
  }

  getOrDefault(): RainierRCValues {
    return this.rainierRc
      ? this.rainierRc[this.configName]
        ? this.transformConfig(this.rainierRc[this.configName])
        : this.transformConfig(this.defaultConfigValue)
      : this.transformConfig(this.defaultConfigValue);
  }
}
