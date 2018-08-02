import { join } from 'path';

import { copySync } from 'fs-extra';
import { rollup, OutputOptions, RollupFileOptions } from 'rollup';
const terser = require('rollup-plugin-terser').terser;
const sourceMaps = require('rollup-plugin-sourcemaps');

// umd min
const umdMinInputOptions: RollupFileOptions = {
  input: `dist/es/public_api.js`,
  plugins: [sourceMaps(), terser()],
};
const umdMinOutputOptions: OutputOptions = {
  file: './dist/bundles/tinycolor.umd.min.js',
  format: 'umd',
  sourcemap: true,
  name: 'tinycolor',
  exports: 'named',
};

async function build() {
  // create browser bundle
  const umdMin = await rollup(umdMinInputOptions);
  await umdMin.write(umdMinOutputOptions);

  // copy git folder to dist folder for semantic-release
  copySync('.git', join(process.cwd(), 'dist/.git'));
  // copy files to distribution folder
  copySync('package.json', join(process.cwd(), 'dist/package.json'));
  copySync('README.md', join(process.cwd(), 'dist/README.md'));
  copySync('LICENSE', join(process.cwd(), 'dist/LICENSE'));
}

build()
  .then(() => console.log('build success'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
