import { Compiler, compilation } from 'webpack';
import { generatePreBuildFiles } from '../generators/generate-prebuild-files';
import { RainierRC } from 'rainier-rc';
export type Compilation = compilation.Compilation;

export class GeneratePrebuildFilesPlugin {
  private rainierRc: RainierRC;

  constructor(rainierRc: RainierRC) {
    this.rainierRc = rainierRc;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.beforeCompile.tapAsync('GeneratePrebuildFilesPlugin', (params, callback) => {
      generatePreBuildFiles(this.rainierRc);
      callback();
    });
  }
}
