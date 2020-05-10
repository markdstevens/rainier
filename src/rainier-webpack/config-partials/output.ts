import { CustomWebpackOptions } from '../custom-webpack-options';

interface Output {
  filename: string;
  chunkFilename: string;
}

interface OutputWrapper {
  client: (options: CustomWebpackOptions) => Output;
  server: (options: CustomWebpackOptions) => Output;
}

export const output: OutputWrapper = {
  client: (options: CustomWebpackOptions) => ({
    filename: 'client.js',
    chunkFilename: options.isDev
      ? `[name].client.bundle.js`
      : `[name].client.bundle.[chunkhash].js`,
  }),

  server: (options: CustomWebpackOptions) => ({
    filename: 'server.js',
    chunkFilename: options.isDev
      ? `[name].server.bundle.js`
      : `[name].server.bundle.[chunkhash].js`,
  }),
};
