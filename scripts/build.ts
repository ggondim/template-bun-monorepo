import type { BuildConfig } from 'bun'
import dts from 'bun-plugin-dts'
import path from 'path';
import { parseArgs } from 'util';

console.log(`cwd: `, process.cwd());
console.log(`dir: `, __dirname);

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    config: {
      type: 'string',
      alias: 'c'
    },
    in: {
      type: 'string',
      alias: 'i'
    },
    out: {
      type: 'string',
      alias: 'o'
    },
  },
  allowPositionals: true,
});

let input: string;
let outdir: string;

if (values.config) {
  const config = await import(path.resolve(process.cwd(), values.config));
  input = config.compilerOptions.rootDir;
  outdir = config.compilerOptions.outDir;
} else {
  input = values.in ?? './index.ts';
  outdir = values.out ?? './dist';
}

const entrypoint = input.indexOf(".ts") !== -1 ? input : `${input}/index.ts`;

const defaultBuildConfig: BuildConfig = {
  entrypoints: [entrypoint],
  outdir,
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
