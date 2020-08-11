import { Event } from 'rainier-event';
import { RainierLogLevel } from './log-level';

type LogFields = {
  event?: Event;
  type?: keyof typeof RainierLogLevel;
  fields: Record<string, any>;
};

interface RainierLogger {
  log(options: LogFields): void;
}

export type { RainierLogger, LogFields };
