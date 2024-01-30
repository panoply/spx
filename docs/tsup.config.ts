import { defineConfig } from 'tsup';
import { basename, join } from 'node:path';
import { readdir } from 'node:fs/promises';
import ZIP from 'adm-zip';
import * as pkg from '../package.json';

/**
 * ZIP
 *
 * Archive function to generate a `.zip` file export
 */
async function zip (input: string, output: string) {
  const zip = new ZIP();
  await zip.addLocalFolderPromise(input, {});
  await zip.writeZipPromise(output);
};

/**
 * UNZIP
 *
 * Unarchive function used to extract the documentation version
 */
function unzip (input: string, output: string) {

  return new ZIP(input).extractAllTo(output, true);

};

/**
 * VERSIONS
 *
 * The `onSuccess` function callback applied to tsup. When ENV is production
 * the version are generated and written to `public` directory.
 */
async function versions () {

  const cwd = process.cwd();
  const { version } = pkg;
  const beta = /-beta\.\d$/.test(version);
  const name = beta ? version.replace(/\.\d-beta\.\d$/, 'x-beta') : version.replace(/\.\d$/, 'x');
  const dir = join(cwd, 'version', `${name}`);

  await zip(join(cwd, 'public'), `${dir}.zip`);

  console.log(`\x1b[36mZIP\x1b[39m version \x1b[1m${name}\x1b[22m copied into \x1b[1mversion\x1b[22m`);

  const files = await readdir(join(cwd, 'version'));

  for (const file of files) {
    const base = basename(file, '.zip');
    unzip(join(cwd, 'version', file), join(cwd, 'public/v', base));
    console.log(`\x1b[36mZIP\x1b[39m created \x1b[1mv/${base}\x1b[22m in \x1b[1mpublic\x1b[22m`);
  }

};

export default defineConfig(
  {
    entry: {
      'bundle.min': './src/app/index.ts',
      'spx.min': './src/app/spx.ts'
    },
    outDir: './public',
    outExtension: () => ({
      js: '.js'
    }),
    async onSuccess () {
      if (this.env && this.env.NODE_ENV === 'production') {
        await versions();
      }
    },
    clean: false,
    treeshake: false,
    splitting: false,
    platform: 'browser',
    format: [
      'iife'
    ]
  }
);
