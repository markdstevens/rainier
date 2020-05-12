import { CustomWebpackOptions } from '../custom-webpack-options';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { RainierRC } from '../../rainier-rc';
import { GeneratePrebuildFilesPlugin } from '../custom-plugins/generate-prebuild-files-plugin';

export const webpackCommon = (
  options: CustomWebpackOptions,
  rainierRc: RainierRC
): webpack.Configuration => {
  return {
    mode: options.mode,
    output: {
      publicPath: '/',
    },
    watch: options.isDev && !(options.profileClient || options.profileServer),
    watchOptions: {
      ignored: /rainier-(.*)/,
      aggregateTimeout: 300,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.png'],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/i,
          use: ['url-loader'],
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@loadable/babel-plugin',
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-proposal-optional-chaining',
                  ['@babel/plugin-proposal-decorators', { legacy: true }],
                  ['@babel/plugin-proposal-class-properties', { loose: true }],
                ],
                presets: [
                  ['@babel/env', { modules: false }],
                  ['@babel/preset-react'],
                  ['@babel/preset-typescript'],
                ],
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
        __CONTROLLERS_DIR__: JSON.stringify(rainierRc.controllersDir),
        __I18N_DIR__: JSON.stringify(rainierRc.i18nDir),
      }),
      new MiniCssExtractPlugin({
        filename: options.isDev ? '[name].css' : '[name]-[contenthash].css',
      }),
      new GeneratePrebuildFilesPlugin(rainierRc),
    ],
  };
};
