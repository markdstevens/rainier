import { Event } from 'rainier-event';
import { RainierLogLevel } from './log-level';

type Fields = {
  event?: Event;
  type?: keyof typeof RainierLogLevel;
  fields: Record<string, any>;
};

interface RainierLogger {
  log(options: Fields): void;
}

interface LogOptions {
  event?: Event;
  type?: keyof typeof RainierLogLevel;
}

export type { RainierLogger, LogOptions };
