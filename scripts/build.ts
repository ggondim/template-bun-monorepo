import type { BuildConfig } from 'bun'
import dts from 'bun-plugin-dts'
import { parseArgs } from 'util';

// console.log(`cwd: `, process.cwd());

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    pkg: {
      type: 'string',
      alias: 'p'
    },
  },
  strict: true,
  allowPositionals: true,
});

// console.log(`package: `, values.pkg);

const dir = values.pkg?.startsWith('.') ? values.pkg : `./packages/${values.pkg}`;
// console.log(`dir: `, dir);

const defaultBuildConfig: BuildConfig = {
  entrypoints: [`${dir}/index.ts`],
  outdir: `${dir}/dist`
};

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    plugins: [dts()],
    format: 'esm',
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: 'cjs',
    naming: "[dir]/[name].cjs",
  })
]);
