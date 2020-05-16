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
            maxInitialRequests: Infinity,
            minSize: 0,
            chunks: 'all',
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: 1,
            name: 'vendors',
            maxInitialRequests: Infinity,
            minSize: 0,
            chunks: 'all',
          },
          rainier: {
            test: /[\\/]rainier[\\/]/,
            priority: 2,
            name: 'rainier',
            maxInitialRequests: Infinity,
            minSize: 0,
            chunks: 'all',
          },
        },
      },
    },
  });
};
