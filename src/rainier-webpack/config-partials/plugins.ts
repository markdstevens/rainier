import { CustomWebpackOptions } from '../custom-webpack-options';
import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { RainierRC } from '../../rainier-rc';

export const plugins = {
  client: (options: CustomWebpackOptions, rainierRc: RainierRC): webpack.Plugin[] => {
    const plugins = [
      new webpack.DefinePlugin({
        __BROWSER__: true,
      }),
      new HtmlWebpackPlugin({
        title: 'React App',
        filename: 'index.html',
        template: path.join(__dirname, '../../../src/rainier-server/views/index.hbs'),
      }),
      new LoadablePlugin(),
    ];

    if (options.profileClient) {
      plugins.push(new BundleAnalyzerPlugin());
    }

    if (options.isDev) {
      plugins.push(
        ...[
          new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['!server*.js'],
            cleanAfterEveryBuildPatterns: ['!server*.js'],
            cleanStaleWebpackAssets: false,
          }),
        ]
      );
    }

    if (options.isProd) {
      plugins.push(
        ...[
          new WorkboxWebpackPlugin.InjectManifest({
            swSrc: '../../rainier-public/service-worker.js',
            swDest: 'service-worker.js',
          }),
        ]
      );
    }

    return plugins;
  },

  server: (options: CustomWebpackOptions, rainierRc: RainierRC): webpack.Plugin[] => {
    const plugins = [
      new webpack.DefinePlugin({
        __BROWSER__: false,
      }),
    ];

    if (rainierRc.publicAssetsDir) {
      plugins.push(new CopyWebpackPlugin([{ from: rainierRc.publicAssetsDir }]));
    }

    if (options.profileServer) {
      plugins.push(new BundleAnalyzerPlugin());
    }

    if (options.isDev) {
      plugins.push(
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: ['!client*.js'],
          cleanAfterEveryBuildPatterns: ['!client*.js'],
          cleanStaleWebpackAssets: false,
        })
      );
      if (!options.profileClient && !options.profileServer) {
        plugins.push(
          new NodemonPlugin({
            script: `${process.env.ORIGINAL_DIR}/dist/server.js`,
            watch: [`${process.env.ORIGINAL_DIR}/dist/`],
            ext: 'ts,tsx,js,jsx,json,mjs',
          })
        );
      }
    }

    return plugins;
  },
};
