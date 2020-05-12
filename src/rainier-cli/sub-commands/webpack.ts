import { runWebpack } from '../../rainier-webpack';
import { program } from 'commander';
import { getRainierRc } from '../../rainier-rc';

const args = program
  .option('--profile-client', 'Run webpack bundle analyzer for the client bundle', false)
  .option('--profile-server', 'Run webpack bundle analyzer for the server bundle', false)
  .parse(process.argv)
  .opts();

const options = {
  mode: process.env.NODE_ENV === 'prod' ? 'production' : 'development',
  profileClient: args.profileClient,
  profileServer: args.profileServer,
} as const;

runWebpack(options, getRainierRc());
