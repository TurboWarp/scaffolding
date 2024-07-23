const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const dist = path.resolve(__dirname, 'dist');

const makeScaffolding = ({inlineMusic}) => ({
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? '' : 'source-map',
  output: {
    filename: '[name].js',
    path: dist
  },
  entry: inlineMusic ? {
    'scaffolding-inline-music': './src/index.js'
  } : {
    'scaffolding-min': './src/index.js'
  },
  // resolve: {
  //   alias: {
  //     'text-encoding$': path.resolve(__dirname, 'src', 'scaffolding', 'text-encoding'),
  //     'htmlparser2$': path.resolve(__dirname, 'src', 'scaffolding', 'htmlparser2'),
  //     'scratch-translate-extension-languages$': path.resolve(__dirname, 'src', 'scaffolding', 'scratch-translate-extension-languages', 'languages.json'),
  //     'scratch-parser$': path.resolve(__dirname, 'src', 'scaffolding', 'scratch-parser')
  //   }
  // },
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
      // {
      //   test: /\.(svg|png)$/i,
      //   use: [{
      //     loader: 'url-loader'
      //   }]
      // },
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
  resolveLoader: {
    modules: [
      // Replace worker-loader with our own modified version
      // path.resolve(__dirname, 'src-build', 'module-overrides', 'inline-worker-loader'),
      'node_modules',
    ],
  },
});

module.exports = [
  makeScaffolding({inlineMusic: true}),
  makeScaffolding({inlineMusic: false})
];
