import webpack from 'webpack';
import merge from 'webpack-merge';
import { CustomWebpackOptions } from '../types';
import { webpackCommon } from './webpack-common';
import { entry, target, output, plugins } from '../config-partials';
import type { RainierRC } from 'rainier-rc/types';

export const webpackServer = (
  options: CustomWebpackOptions,
  rainierRc: RainierRC
): webpack.Configuration => {
  return merge.smart(webpackCommon(options, rainierRc), {
    entry: entry.server(),
    target: target.server(),
    node: {
      __dirname: true,
      __filename: true,
    },
    output: output.server(options),
    plugins: plugins.server(options, rainierRc),
  });
};
