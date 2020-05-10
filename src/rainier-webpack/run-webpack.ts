import webpack from 'webpack';
import { webpackServer, webpackClient } from './config-templates';
import { CustomWebpackOptions } from './custom-webpack-options';
import chalk from 'chalk';
import { RainierRC } from '../rainier-rc';

export const runWebpack = (options: CustomWebpackOptions, rainierRC: RainierRC): void => {
  console.info('running webpack with 👇');
  console.table(options);

  options.isDev = options.mode === 'development';
  options.isProd = options.mode === 'production';

  const clientConfig = webpackClient(options, rainierRC);
  const serverConfig = webpackServer(options, rainierRC);

  webpack(clientConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.info(
        chalk.red(
          stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true, // Shows colors in the console
          })
        )
      );
    }
    console.info(chalk.green('Client webpacking complete!'));
  });

  webpack(serverConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      // eslint-disable-next-line
      console.info(
        chalk.red(
          stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true, // Shows colors in the console
          })
        )
      );
    }

    console.info(chalk.green('Server webpacking complete!'));
  });
};
