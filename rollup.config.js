import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'

import pkg from './package.json'

const external = ['semver/functions/valid', 'semver/functions/major']

const replacePlugin = replace({
  preventAssignment: true,
  values: {
    'globalThis.__pkg_version': JSON.stringify(pkg.version),
  },
})

export default [
  {
    input: './lib/index.ts',
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: { target: 'es5' },
      }),
      replacePlugin,
    ],
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'lib/index.ts',
    external,
    plugins: [typescript(), replacePlugin],
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
  },
]
