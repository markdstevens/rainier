#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import { program } from 'commander';
import { Command } from './command';

process.env.ORIGINAL_DIR = process.cwd();

clear();

console.info(
  chalk.cyanBright(
    figlet.textSync('Rainier', {
      horizontalLayout: 'full',
    })
  )
);

const commands = [new Command('webpack', 'webpack', 'compile project with webpack')];

commands.forEach((command) => {
  program.command(command.commandName, command.description, {
    executableFile: `sub-commands/${command.key}`,
  });
});

program.parse(process.argv);
