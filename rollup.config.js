import flow from 'rollup-plugin-flow';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const format = 'es';

export default {
  input: 'source/index.js',
  external: ['react', 'prop-types'],
  plugins: [
    flow(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        [
          '@babel/preset-stage-2',
          {
            loose: true,
            useBuiltIns: true,
          },
        ],
      ],
    }),
    uglify({}, minify),
  ],
  output: {
    name: 'reform-redux',
    file: `dist/reform-redux.${format}.js`,
    format,
  },
};
