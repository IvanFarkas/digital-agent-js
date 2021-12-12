const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const corePath = path.resolve(__dirname, './src/core/');
const threePath = path.resolve(__dirname, 'src/three.js/');

const baseConfig = {
  mode: 'production',
  devtool: 'eval-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'HOST',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: '(typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this)',
  },
  optimization: {
    minimize: true,
    minimizer: [
      (compiler) => {
        return () => {
          return {
            terserOptions: {
              mangle: {
                reserved: ['Td', 'Tr', 'Th', 'Thead'],
              },
            },
          };
        };
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ico)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'file-loader',
          options: {
            name: ['[name].[ext]'],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `3D HD Soft, LLC`,
      entryOnly: true,
    }),
  ],
  resolve: {
    alias: {
      core: corePath,
    },
  },
};

const coreConfig = {
  ...baseConfig,
  entry: {
    'host.core': ['babel-polyfill', './src/core/index.js'],
  },
  resolve: {
    alias: {
      ...baseConfig.resolve.alias,
      app: corePath,
    },
  },
};

const threeConfig = {
  ...baseConfig,
  entry: {
    'host.three': ['babel-polyfill', './src/three.js/index.js'],
  },
  resolve: {
    alias: {
      ...baseConfig.resolve.alias,
      app: threePath,
    },
  },
};

module.exports = [coreConfig, threeConfig];
