import { existsSync } from 'fs';
import { logger } from '@rainier/logger';
import { RainierRC } from './rainier-rc';
import chalk from 'chalk';

export const getRainierRc = (): RainierRC | null => {
  const cwd = process.cwd();
  const rainierRC = `${cwd}/.rainierrc`;

  if (!existsSync(rainierRC)) {
    logger.info(chalk.magenta(`no .rainierrc found in ${rainierRC}`));
    return null;
  }

  const rainierConfig = require(rainierRC) as RainierRC;

  logger.info(rainierConfig);
  // validate config

  return rainierConfig;
};
