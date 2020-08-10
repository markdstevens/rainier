import webpack from 'webpack';
import { webpackServer, webpackClient } from './config-templates';
import type { CustomWebpackOptions } from './types';
import type { RainierRC } from 'rainier-rc/types';

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
        if (err) {
          console.error(err.stack || err);
          return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          console.log(info.errors);
        }
      }
    );
  } else {
    compiler.run((err, stats) => console.log(stats.toJson()));
  }
};
