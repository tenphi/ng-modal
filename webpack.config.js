var Webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');
var path = require('path');

var config;

config = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src', 'modal.js'),
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'modal.js'
  },
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
      },
      {
        test: /\.html$/,
        loader: 'raw!html-minify-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=100000!hash=sha512&digest=hex&name=[hash].[ext]',
          'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },

  postcss: [autoprefixer, csswring],

  'html-minify-loader': {
    empty: true,
    cdata: true,
    comments: false
  },

  plugins: [
    new Webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};

module.exports = config;