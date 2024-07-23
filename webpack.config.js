const path = require('path');
const EagerImportsPlugin = require('./src-build/eager-imports-plugin/eager-imports-plugin.js');

const isProduction = process.env.NODE_ENV === 'production';

const makeScaffolding = ({inlineMusic}) => ({
  mode: isProduction ? 'production' : 'development',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  entry: inlineMusic ? {
    'scaffolding-inline-music': './src/index.js'
  } : {
    'scaffolding-min': './src/index.js'
  },
  resolve: {
    alias: {
      'text-encoding$': path.resolve(__dirname, 'src-build/text-encoding'),
      'htmlparser2$': path.resolve(__dirname, 'src-build/htmlparser2'),
      'scratch-translate-extension-languages$': path.resolve(__dirname, 'src-build/scratch-translate-extension-languages/languages.json'),
      'scratch-parser$': path.resolve(__dirname, 'src-build/scratch-parser')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.mp3$/i,
        use: [
          {
            loader: inlineMusic ? (
              path.resolve(__dirname, 'src-build', 'cjs-url-loader')
            ) : (
              path.resolve(__dirname, 'src-build', 'cjs-noop-loader')
            )
          }
        ]
      },
    ]
  },
  plugins: [
    new EagerImportsPlugin(),
  ],
  resolveLoader: {
    modules: [
      // Replace worker-loader with our own modified version
      path.resolve(__dirname, 'src-build', 'inline-worker-loader'),
      'node_modules',
    ],
  },
});

module.exports = [
  makeScaffolding({inlineMusic: true}),
  makeScaffolding({inlineMusic: false})
];
