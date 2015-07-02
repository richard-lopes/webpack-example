/**
 * Copyright (C) MYOB - 2015
 */

'use strict';

var env = process.env.NODE_ENV || 'development',
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  autoprefixer = require('autoprefixer-core'),
  csswring = require('csswring'),
  path = require('path'),
  modulesPath = path.join(__dirname, 'node_modules'),
  srcPath = path.join(__dirname, 'src'),
  libs = [
    'react;react/addons;react/dist/react-with-addons.min.js',
    //'react-router;react-router/umd/ReactRouter.min.js',
    //'alt/utils;alt/utils',
    //'alt;alt/dist/alt-with-addons.js'
  ];

function getEntries(entries) {
  entries.common = ['react', 'react-router', 'alt'];
  return entries;
}

function getOutput() {
  if (env === 'development') return path.join(__dirname, 'tmp');
  return path.join(__dirname, 'dist');
}

function getAliases(aliases) {
  if (env === 'development') {
    // Dynamically generate aliases (to reduce verbosity and reduce manual errors)
    libs.forEach(function(lib) {
      var parts = lib.split(';'),
        l = parts.length - 1,
        libPath = path.resolve(modulesPath, parts[l]);

      while (l--) aliases[parts[l]] = libPath;
    });
  }
  return aliases;
}

function getNoParse(excluded) {
  if (env === 'development') {
    // Dynamically generate no parse rules (to reduce verbosity and reduce manual errors)
    libs.forEach(function(lib) {
      var parts = lib.split(';'),
        libPath = path.resolve(modulesPath, parts[parts.length - 1]);

      excluded.push(libPath);
    });
  }
  return excluded;
}

function getPlugins(plugins) {
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      // This has an effect on the react lib size
      NODE_ENV: JSON.stringify(env)
    }
  }));
  plugins.push(new webpack.optimize.CommonsChunkPlugin('common', 'common.js'));

  if (env === 'development') {
    plugins.push(new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    }));
    plugins.push(new webpack.NoErrorsPlugin());

    plugins.push(new webpack.PrefetchPlugin('babel-runtime/core-js'));
    plugins.push(new webpack.PrefetchPlugin('babel-runtime/core-js/object'));
    plugins.push(new webpack.PrefetchPlugin('babel-runtime/regenerator'));
    plugins.push(new webpack.PrefetchPlugin('react'));
    plugins.push(new webpack.PrefetchPlugin('react-router'));
    plugins.push(new webpack.PrefetchPlugin('alt'));
  }
  else {
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurenceOrderPlugin(true));
  }
  return plugins;
}

function getExternals(externals) {
  if (env === 'production') {
    // Dynamically generate externals (to reduce verbosity and reduce manual errors)
    libs.forEach(function(lib) {
      var parts = lib.split(';'),
        l = parts.length - 1;

      while (l--) externals[parts[l]] = parts[0];
    });
  }
  return externals;
}

module.exports = {
  target: 'web',
  cache: true,
  entry: getEntries({module: path.join(srcPath, 'module.js')}),
  resolve: {
    root: srcPath,
    alias: getAliases({'react/lib': path.resolve(modulesPath, 'react/lib')}),
    extensions: ['', '.js', '.json'],
    modulesDirectories: ['node_modules', 'src']
  },
  output: {
    path: getOutput(),
    publicPath: '',
    filename: '[name].js',
    library: ['Ledgers', '[name]'],
    pathInfo: env === 'development'
  },

  module: {
    noParse: getNoParse([]),
    preloaders: [
      {test: /\.js?$/, exclude: /node_modules/, loader: 'eslint'}
    ],
    loaders: [
      {test: path.resolve(modulesPath, 'react/dist/react-with-addons.min.js'), loader: 'expose?React'},
      {test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
      {test: /\.(css|scss)$/, loader: 'style!css!sass!postcss'}
    ]
  },
  postcss: [autoprefixer({browsers: ['last 2 versions', 'ie >= 9']}), csswring],
  plugins: getPlugins([]),

  debug: env === 'development',
  devtool: env === 'development' ? '#cheap-module-eval-source-map' : '',
  devServer: {
    contentBase: './tmp',
    historyApiFallback: true
  },

  // Library dependencies are better not be bundled as consumer will import them as needed
  externals: getExternals({})
};
