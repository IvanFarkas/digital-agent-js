const {merge} = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common[0], {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    open: 'Google Chrome',
    liveReload: true,
    hot: false,
    static: {
      directory: path.resolve(__dirname),
      serveIndex: true,
      staticOptions: {
        watchContentBase: true,
      },
    },
    // open: 'Google Chrome',
    // liveReload: true,
    // contentBase: [path.join(__dirname)],
    // watchContentBase: true,
    // hot: false,
  },
});
