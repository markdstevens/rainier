import webpack from 'webpack';
import { webpackServer, webpackClient } from './config-templates';
import { CustomWebpackOptions } from './custom-webpack-options';
import chalk from 'chalk';
import { RainierRC } from '../rainier-rc';

export const runWebpack = (options: CustomWebpackOptions, rainierRC: RainierRC): void => {
  console.info('running webpack with 👇');
  console.table(options);

  process.chdir(__dirname);

  options.isDev = options.mode === 'development';
  options.isProd = options.mode === 'production';

  const compiler = webpack([webpackClient(options, rainierRC), webpackServer(options, rainierRC)]);

  if (options.isDev) {
    compiler.watch(
      {
        aggregateTimeout: 300,
        poll: true,
        ignored: /node_modules/,
      },
      (err, stats) => {
        console.log(chalk.green('finished recompiling!'));
      }
    );
  }
};
