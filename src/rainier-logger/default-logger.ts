import { RainierLogger, LogOptions } from './types';
import { RainierLogLevel } from './log-level';
import chalk from 'chalk';
import { Event } from 'rainier-event';
import { collectionUtils } from 'rainier-util/collection-utils';

function recordToStringConverter(record: Record<string, any>): string {
  const strings: string[] = [];
  Object.entries(record).forEach(([key, val]) => strings.push(`${key}=${val}`));
  return strings.join(' ');
}

function toLogString(
  color: chalk.Chalk,
  fields: Record<string, any>,
  logOptions?: LogOptions
): void {
  const logFields: string[] = [];

  if (logOptions?.event) {
    logFields.push(`event=${Event[logOptions.event]}`);
  }

  if (logOptions?.type) {
    logFields.push(`type=${logOptions?.type}`);
  }

  logFields.push(recordToStringConverter(fields));

  console.log(color(logFields.join(' ')));
}

function logDebug(fields: Record<string, any>, event?: Event): void {
  toLogString(chalk.black, fields, {
    type: RainierLogLevel.DEBUG,
    event,
  });
}

function logInfo(fields: Record<string, any>, event?: Event): void {
  toLogString(chalk.blue, fields, {
    type: RainierLogLevel.INFO,
    event,
  });
}

function logWarn(fields: Record<string, any>, event?: Event): void {
  toLogString(chalk.yellow, fields, {
    type: RainierLogLevel.WARN,
    event,
  });
}

function logError(fields: Record<string, any>, event?: Event): void {
  toLogString(chalk.red, fields, {
    type: RainierLogLevel.ERROR,
    event,
  });
}

const logger: RainierLogger = {
  log(options) {
    if (
      collectionUtils.isNotNullOrUndefined(options) &&
      collectionUtils.isNotNullOrUndefined(options.type)
    ) {
      const { type, event, fields } = options;
      switch (type) {
        case RainierLogLevel.DEBUG:
          logDebug(fields, event);
          break;
        case RainierLogLevel.INFO:
          logInfo(fields, event);
          break;
        case RainierLogLevel.WARN:
          logWarn(fields, event);
          break;
        case RainierLogLevel.ERROR:
          logError(fields, event);
          break;
      }
    } else if (options?.event) {
      toLogString(chalk.black, options.fields, {
        event: options.event,
      });
    } else {
      toLogString(chalk.black, options?.fields);
    }
  },
};

export default logger;
