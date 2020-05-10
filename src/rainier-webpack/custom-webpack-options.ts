export interface CustomWebpackOptions {
  mode: 'development' | 'production';
  isDev?: boolean;
  isProd?: boolean;
  profileClient: boolean;
  profileServer: boolean;
}
