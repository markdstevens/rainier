import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import type { RainierRC } from 'rainier-rc/types';
import type { CustomWebpackOptions } from '../types';

export const plugins = {
  client: (options: CustomWebpackOptions, rainierRc: RainierRC): webpack.Plugin[] => {
    const plugins = [
      new webpack.DefinePlugin({
        __BROWSER__: true,
        __CSS_GLOBAL_FILE__: JSON.stringify(rainierRc.cssGlobalFile),
      }),
      new HtmlWebpackPlugin({
        title: 'React App',
        filename: 'index.html',
        template: path.join(__dirname, '../../rainier-server/views/index.hbs'),
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

    plugins.push(
      ...[
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: '../rainier-public/service-worker.js',
          swDest: 'service-worker.js',
          exclude: ['loadable-stats.json', 'index.html'],
        }),
      ]
    );

    return plugins;
  },

  server: (options: CustomWebpackOptions, rainierRc: RainierRC): webpack.Plugin[] => {
    const plugins = [
      new webpack.DefinePlugin({
        __BROWSER__: false,
      }),
    ];

    if (rainierRc.publicAssetsDir) {
      plugins.push(new CopyWebpackPlugin([{ from: rainierRc.publicAssetsDir }, { from: '' }]));
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
