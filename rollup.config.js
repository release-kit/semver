import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'
import bundleSize from 'rollup-plugin-bundle-size'
import esbuild from 'rollup-plugin-esbuild'

const src = (file) => `src/${file}`
const dist = (file) => `dist/${file}`

const bundle = (input, config) =>
  defineConfig({
    ...config,
    input,
    plugins: [...(config.plugins || []), bundleSize()],
  })

const config = defineConfig([
  bundle(src('index.ts'), {
    plugins: [
      commonjs({ transformMixedEsModules: true }),
      esbuild(),
      nodeResolve({ preferBuiltins: true }),
    ],
    output: [
      {
        file: dist('index.js'),
        format: 'cjs',
        globals: { crypto: 'crypto' },
      },
    ],
    external: ['crypto']
  }),
])

// eslint-disable-next-line import/no-default-export
export default config
