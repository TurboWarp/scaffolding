const path = require('node:path');
const fs = require('node:fs');
const webpack = require('webpack');
const EagerImportsPlugin = require('./src-build/eager-imports-plugin/eager-imports-plugin.js');

const isProduction = process.env.NODE_ENV === 'production';

const dist = path.resolve(__dirname, 'dist');
fs.rmSync(dist, {
  force: true,
  recursive: true
});

const makeScaffolding = ({withMusic}) => ({
  mode: isProduction ? 'production' : 'development',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: dist
  },
  entry: withMusic ? {
    'scaffolding-with-music': './src/index.js'
  } : {
    'scaffolding': './src/index.js'
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
        test: /scratch3_music[/\\]assets[/\\].*\.mp3$/i,
        use: [
          {
            loader: withMusic ? (
              path.resolve(__dirname, 'src-build', 'cjs-data-url-loader')
            ) : (
              path.resolve(__dirname, 'src-build', 'cjs-remote-music-asset-loader')
            )
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
    }),
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
  makeScaffolding({withMusic: false}),
  makeScaffolding({withMusic: true})
];
