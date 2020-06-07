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

const commands = [
  new Command('build', 'Compile project with webpack'),
  new Command('init', 'Scaffold a new rainier project'),
];

commands.forEach((command) => {
  program.command(command.commandName, command.description, {
    executableFile: `sub-commands/${command.key}/index`,
  });
});

program.parse(process.argv);
