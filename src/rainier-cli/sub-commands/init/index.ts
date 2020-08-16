import path from 'path';
import { Plop, run } from 'plop';

Plop.launch(
  {
    cwd: process.env.ORIGINAL_DIR,
    configPath: path.join(__dirname, 'plopfile.js'),
  },
  (env) => run(env, undefined, true)
);
