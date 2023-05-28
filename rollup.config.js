import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'
import bundleSize from 'rollup-plugin-bundle-size'
import esbuild from 'rollup-plugin-esbuild'

const src = (file) => `src/${file}`
const dist = (file) => `dist/${file}`

const config = defineConfig({
  input: src('index.ts'),
  plugins: [
    commonjs(),
    esbuild(),
    nodeResolve({ exportConditions: ['node'] }),
    bundleSize(),
  ],
  output: [
    {
      file: dist('index.js'),
      format: 'cjs',
    },
  ],
})

// eslint-disable-next-line import/no-default-export
export default config
