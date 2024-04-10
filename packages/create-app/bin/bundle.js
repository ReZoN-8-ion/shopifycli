import {build as esBuild} from 'esbuild'
import cleanBundledDependencies from '../../../bin/bundling/clean-bundled-dependencies.js'
import ShopifyStacktraceyPlugin from '../../../bin/bundling/esbuild-plugin-stacktracey.js'
import glob from 'fast-glob'
import { copy } from 'esbuild-plugin-copy'

const external = [
  'react-devtools-core',  // react-devtools-core is a dev dependency,  no need to bundle it but throws errors if not included here.
]

const yogafile = glob.sync('../../node_modules/.pnpm/**/yoga.wasm')[0]

await esBuild({
  bundle: true,
  entryPoints: ['./src/**/*.ts'],
  outdir: './dist',
  platform: 'node',
  format: 'esm',
  inject: ['../../bin/bundling/cjs-shims.js'],
  external,
  loader: {'.node': 'copy'},
  splitting: true,
  plugins: [
    ShopifyStacktraceyPlugin,
    copy({
      // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
      // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
      resolveFrom: 'cwd',
      assets: [
        {
          from: [yogafile],
          to: ['./dist/'],
        }
      ]
    }),
  ],
})

await cleanBundledDependencies(external)


