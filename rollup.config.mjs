import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
  {
    input: 'src/index.ts',
    onwarn(warning, warn) {
      if (
        warning.code === 'THIS_IS_UNDEFINED' &&
        typeof warning.id === 'string' &&
        warning.id.includes('@zxing')
      ) {
        return;
      }

      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        const ids = Array.isArray(warning.ids) ? warning.ids : [];
        if (ids.some((id) => typeof id === 'string' && id.includes('@zxing'))) {
          return;
        }
      }

      warn(warning);
    },
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: 'react-ts-lib',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      webWorkerLoader(),
      external(),
      resolve({ extensions }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        module: 'esnext',
        declaration: false,
        emitDeclarationOnly: false,
      }),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.d.ts', format: 'esm', chunkFileNames: '[name].js' },
    ],
    plugins: [dts({ tsconfig: './tsconfig.json' })],
  },
];
