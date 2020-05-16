import { Event } from '../rainier-event';

interface SchedulerInteraction {
  id: number;
  name: string;
  timestamp: number;
}

type EventParams = {
  [key: string]: any;
};

const loggerUtils = {
  convertToLogString: (obj: EventParams = {}): string => {
    const getVal = (val: any): string | null => {
      if (val == null) return null;
      if (typeof val === 'string' || typeof val === 'number') {
        return val.toString();
      }
      if (typeof val[Symbol.iterator] !== 'function') return val.toString();
      let returnVal = '';
      for (const property of val) {
        returnVal += `,${property}`;
      }
      return returnVal || null;
    };

    return Object.keys(obj)
      .reduce((currentStr, nextKey) => {
        currentStr += `${nextKey}="${getVal(obj[nextKey])}" `;
        return currentStr;
      }, '')
      .trim();
  },
};

export const logger = {
  info: (...messages: any[]): void => {
    messages.forEach((msg) => console.log(msg));
  },

  table: (obj: object): void => {
    console.table(obj);
  },

  warn: (msg: string): void => {
    console.warn(msg);
  },

  error: (err: string, e: Error): void => {
    console.error(`${err} error=${e}`);
  },

  terminalError: (msg: string): never => {
    console.error(msg + `\n`);
    process.exit(1);
  },

  event: (event: Event, msg: string, params: EventParams = {}): void => {
    console.log(
      `event="${Event[event]}" message="${msg}" ${loggerUtils.convertToLogString(params)}`.trim()
    );
  },

  /**
   * @description A callback function for logging information about components
   * and their lifecycles. It will only be used in development.
   *
   * @documation https://reactjs.org/docs/profiler.html
   *
   * @param {string} id the "id" of the Profiler tree that has just committed
   * @param {'mount' | 'updated'} phase commit phase
   * @param {number} actualDuration time spent rendering the committed update
   * @param {number} baseDuration estimated time to render the entire subtree
   * without memoization
   * @param {number} startTime when React began rendering this update
   * @param {number} commitTime when React committed this update
   * @param {Set<SchedulerInteraction>} interactions the Set of interactions
   * belonging to this update
   */
  profile: (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<SchedulerInteraction>
  ): void => {
    logger.info(
      loggerUtils.convertToLogString({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      })
    );
  },
};
