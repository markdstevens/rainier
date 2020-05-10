import webpack from 'webpack';
import merge from 'webpack-merge';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { webpackCommon } from './webpack-common';
import { CustomWebpackOptions } from '../custom-webpack-options';
import { entry, target, output, plugins } from '../config-partials';
import { RainierRC } from '../../rainier-rc';

export const webpackClient = (
  options: CustomWebpackOptions,
  rainierRc: RainierRC
): webpack.Configuration => {
  return merge.smart(webpackCommon(options, rainierRc), {
    entry: entry.client(),
    target: target.client(),
    output: output.client(options),
    plugins: plugins.client(options, rainierRc),
    optimization: {
      moduleIds: 'hashed',
      minimizer: [new OptimizeCssAssetsPlugin()],
      splitChunks: {
        cacheGroups: {
          styles: {
            test: /\.scss$/,
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  });
};
