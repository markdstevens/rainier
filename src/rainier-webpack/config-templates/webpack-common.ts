import path from 'path';
import { existsSync } from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import convertPathsToAliases from 'convert-tsconfig-paths-to-webpack-aliases';
import { CustomWebpackOptions } from '../types';
import type { RainierRC } from 'rainier-rc/types';

const aliasesFromClientTsconfig = function (): any {
  const tsconfigPath = `${process.env.ORIGINAL_DIR}/tsconfig.json`;

  if (existsSync(tsconfigPath)) {
    const tsconfig = require(tsconfigPath);
    return convertPathsToAliases(tsconfig, process.env.ORIGINAL_DIR);
  }

  return {};
};

export const webpackCommon = (
  options: CustomWebpackOptions,
  rainierRc: RainierRC
): webpack.Configuration => {
  const appRoot = process.env.ORIGINAL_DIR ?? process.cwd();

  return {
    mode: options.mode,
    output: {
      path: `${appRoot}/dist`,
      publicPath: '/public/',
    },
    devtool: options.isDev ? 'inline-cheap-module-source-map' : false,
    watchOptions: {
      ignored: /rainier-(.*)/,
      aggregateTimeout: 300,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.png'],
      alias: Object.assign(
        {
          'rainier-cli': path.join(__dirname, '../../rainier-cli/'),
          'rainier-client': path.join(__dirname, '../../rainier-client/'),
          'rainier-components': path.join(__dirname, '../../rainier-components/'),
          'rainier-controller': path.join(__dirname, '../../rainier-controller/'),
          'rainier-event': path.join(__dirname, '../../rainier-event/'),
          'rainier-lifecycle': path.join(__dirname, '../../rainier-lifecycle/'),
          'rainier-logger': path.join(__dirname, '../../rainier-logger/'),
          'rainier-public': path.join(__dirname, '../../rainier-public/'),
          'rainier-rc': path.join(__dirname, '../../rainier-rc/'),
          'rainier-server': path.join(__dirname, '../../rainier-server/'),
          'rainier-store': path.join(__dirname, '../../rainier-store/'),
          'rainier-util': path.join(__dirname, '../../rainier-util/'),
          'rainier-view': path.join(__dirname, '../../rainier-view/'),
          'rainier-webpack': path.join(__dirname, '../../rainier-webpack/'),
        },
        aliasesFromClientTsconfig()
      ),
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/i,
          use: ['url-loader'],
        },
        {
          test: /\.(j|t)sx?$/,
          include: [/rainier\/dist/, path.join(process.env.ORIGINAL_DIR || process.cwd(), 'src')],
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@babel/plugin-syntax-top-level-await',
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-proposal-optional-chaining',
                  ['@babel/plugin-proposal-decorators', { legacy: true }],
                  ['@babel/plugin-proposal-class-properties', { loose: true }],
                  '@loadable/babel-plugin',
                ],
                presets: [['@babel/env'], ['@babel/preset-react'], ['@babel/preset-typescript']],
              },
            },
          ],
        },
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          oneOf: [
            {
              test: /\.module\.s?css$/,

              /**
               * ! Remember: loaders are processed from right to left (or bottom up)
               */
              use: [
                MiniCssExtractPlugin.loader,
                'css-modules-typescript-loader',
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                  },
                },
                'sass-loader',
              ],
            },
            {
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: options.isDev,
        __CONTROLLERS_MANIFEST__: JSON.stringify(rainierRc.controller.manifest),
        __RAINIER_ROOT__: JSON.stringify(path.join(__dirname, '../../../')),
        __APP_ROOT__: JSON.stringify(appRoot),
        __APP_SHELL__: JSON.stringify(rainierRc.appShell),
        __INIT_CLIENT_STORES__: JSON.stringify(rainierRc?.store?.initClientStores),
        __INIT_SERVER_STORES__: JSON.stringify(rainierRc?.store?.initServerStores),
        __SERVER_HOOKS__: JSON.stringify(rainierRc?.rainierHooks?.server),
        __CLIENT_HOOKS__: JSON.stringify(rainierRc?.rainierHooks?.client),
      }),
      new MiniCssExtractPlugin({
        filename: options.isDev ? '[name].css' : '[name]-[contenthash].css',
      }),
    ],
  };
};
