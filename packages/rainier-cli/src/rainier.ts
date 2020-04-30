#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import { program } from 'commander';
import { version } from '../package.json';
import { Command } from './command';
import { getRainierRc } from '@rainier/rc';
import { logger } from '@rainier/logger';

clear();

logger.info(
  chalk.cyanBright(
    figlet.textSync('Rainier-CLI', {
      horizontalLayout: 'full',
    })
  )
);

getRainierRc();

const commands = [new Command('webpack', 'compile project with webpack')];

commands.forEach((command) => {
  program.command(command.name, command.description, {
    executableFile: `commands/${command.name}`,
  });
});

program.version(version).parse(process.argv);
