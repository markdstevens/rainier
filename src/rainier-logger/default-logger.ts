import chalk from 'chalk';
import { RainierLogger, LogFields } from './types';
import { RainierLogLevel } from './log-level';

function toLogString(color: chalk.Chalk, fields: Record<string, any>): void {
  if (fields.event) {
    fields.event = fields.event.toString();
  }

  console.log(chalk.cyanBright(`=== Rainier Log ===`));
  console.log(color(JSON.stringify(fields, null, 2)));
}

function logDebug(fields: LogFields): void {
  toLogString(chalk.black, fields);
}

function logInfo(fields: LogFields): void {
  toLogString(chalk.blue, fields);
}

function logWarn(fields: LogFields): void {
  toLogString(chalk.yellow, fields);
}

function logError(fields: LogFields): void {
  toLogString(chalk.red, fields);
}

const logTypeToLogFunctionMap: Record<keyof typeof RainierLogLevel, (fields: LogFields) => void> = {
  [RainierLogLevel.DEBUG]: logDebug,
  [RainierLogLevel.INFO]: logInfo,
  [RainierLogLevel.WARN]: logWarn,
  [RainierLogLevel.ERROR]: logError,
};

const logger: RainierLogger = {
  log(logObject) {
    const { type } = logObject;
    const logFunction = type ? logTypeToLogFunctionMap[type] : logInfo;

    logFunction(logObject);
  },
};

export default logger;
