import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import sass from 'node-sass';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';
import autoprefixer from 'autoprefixer';

export default {
  input: {
    index: 'src/index.js',
    // actions: 'src/redux/actions',
    // api: 'src/redux/api',
    // reducers: 'src/redux/reducers',
    // components: 'src/shared/components',
    // config: 'src/shared/config',
    // helpers: 'src/shared/helpers',
    // hooks: 'src/shared/hooks',
    // img: 'src/shared/img',
    // models: 'src/shared/models',
    // services: 'src/shared/services',
    // scss: 'src/scss/app/scss',
  }, // All of your library files will be named exports from here
  output: [
    {
      // This is an easy way to keep your `main` in sync between rollup & the package
      // file: packageJson.main,
      dir: 'lib',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    // This prevents needing an additional `external` prop in this
    // config file by automaticall excluding peer dependencies
    peerDepsExternal(),
    // "...locates modules using the Node resolution algorithm"
    nodeResolve({
      browser: true,
      extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
      // modulesOnly: true,
      // preserveSymlinks: true,
      alias: {
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
        'react/jsx-runtime': 'react/jsx-runtime.js',
      },
    }),
    // Do Babel transpilation
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      // presets: ['@babel/preset-react'],
      plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
    }),
    // Convert CommonJS modules to ES6
    commonjs(),
    // Does a number of things; Compiles sass, run autoprefixer, creates a sourcemap, and saves a .css file
    postcss({
      preprocessor: (content, id) => new Promise((res) => {
        const result = sass.renderSync({ file: id });

        res({ code: result.css.toString() });
      }),
      plugins: [
        autoprefixer,
        url({
          url: 'inline', // enable inline assets using base64 encoding
          maxSize: 10, // maximum file size to inline (in kilobytes)
          fallback: 'copy', // fallback method to use if max size is exceeded
        }),
      ],
      modules: {
        scopeBehaviour: 'global',
      },
      sourceMap: true,
      extract: true,
    }),
  ],
};
