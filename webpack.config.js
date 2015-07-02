'use strict';

var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  autoprefixer = require('autoprefixer-core'),
  csswring = require('csswring'),
  path = require('path'),
  modulesPath = path.join(__dirname, 'node_modules'),
  srcPath = path.join(__dirname, 'src'),
  libs = [
    'react;react/addons;react/dist/react-with-addons.min.js',
    'react-router;react-router/umd/ReactRouter.min.js',
    //'alt;alt/dist/alt-with-addons.js'
  ];

function getEntries(entries) {
  entries.common = ['react', 'react-router', 'alt'];
  return entries;
}

function getOutput() {
  return path.join(__dirname, 'tmp');
}

function getAliases(aliases) {
  // Dynamically generate aliases (to reduce verbosity and reduce manual errors)
  libs.forEach(function(lib) {
    var parts = lib.split(';'),
      l = parts.length - 1,
      libPath = path.resolve(modulesPath, parts[l]);

    while (l--) aliases[parts[l]] = libPath;
  });
  return aliases;
}

function getNoParse(excluded) {
  // Dynamically generate no parse rules (to reduce verbosity and reduce manual errors)
  libs.forEach(function(lib) {
    var parts = lib.split(';'),
      libPath = path.resolve(modulesPath, parts[parts.length - 1]);

    excluded.push(libPath);
  });
  return excluded;
}

function getPlugins(plugins) {
  plugins.push(new webpack.optimize.CommonsChunkPlugin('common', 'common.js'));

  plugins.push(new HtmlWebpackPlugin({
    inject: true,
    template: 'src/index.html'
  }));
  plugins.push(new webpack.NoErrorsPlugin());
  return plugins;
}

module.exports = {
  target: 'web',
  cache: true,
  entry: getEntries({module: path.join(srcPath, 'module.js')}),
  resolve: {
    root: srcPath,
    alias: getAliases({}),
    extensions: ['', '.js', '.json'],
    modulesDirectories: ['node_modules', 'src']
  },
  output: {
    path: getOutput(),
    publicPath: '',
    filename: '[name].js',
    library: ['Example', '[name]'],
    pathInfo: true
  },

  module: {
    noParse: getNoParse([]),
    preloaders: [
      {test: /\.js?$/, exclude: /node_modules/, loader: 'eslint'}
    ],
    loaders: [
      {test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
      {test: /\.(css|scss)$/, loader: 'style!css!sass!postcss'}
    ]
  },
  postcss: [autoprefixer({browsers: ['last 2 versions', 'ie >= 9']}), csswring],
  plugins: getPlugins([]),

  debug: true,
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    contentBase: './tmp',
    historyApiFallback: true
  }
};
