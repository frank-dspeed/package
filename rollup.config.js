import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'

const output = {
  dir: 'lib', 
  format: 'esm',
  entryFileNames: '[name].js',
  chunkFileNames: 'dependencies-[name].js'
}

const plugins = [json(),resolve(),commonjs({
    esmExternals: ( id ) => { return false; },
    transformMixedEsModules: true,
})]

const bundels = [{
  input: ['src/actions-core.js', 'src/node-fetch.js'],
  output,
  plugins
}]

export default bundels;