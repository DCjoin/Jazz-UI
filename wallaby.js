'use strict';

const path = require('path');
const webpack = require('webpack');

const webpackPostprocessor = require('wallaby-webpack')({

  module: {
    loaders: [
        { test: /\.js(x)?$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.(less|css|json)$/, loader: 'null'}
    ]
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(gif|png|less|css)$/, () => {
        return {}
    }),
    new webpack.ProvidePlugin({
        I18N: path.join(__dirname, 'src/app/lang/zh-cn.js')
    }),
  ],
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },

  resolve: {
    alias:{
      stores: path.join(__dirname, 'src/app/stores'),
      moment:'moment/min/moment.min.js',
      numeral:'numeral/min/numeral.min.js',
      config: path.join(__dirname, 'src/app/config/prod.jsx')
    }
  }
});

module.exports = function (wallaby) {

  return {
    files: [
      {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},
      { pattern: 'src/app/**/*.jsx', load: false, instrument: true },
      { pattern: 'src/app/less/main.less', load: false, instrument: true },
      '!src/app/util/html2canvas.jsx',
      '!src/app/**/*-test.js*',
    ],

    tests: [
      {pattern: 'src/app/**/*-test.js*', load: false, instrument: false},
    ],

    compilers: {
      '**/*.js*': wallaby.compilers.babel(),
    },
    
    postprocessor: webpackPostprocessor,

    setup: function () {
      window.__moduleBundler.loadTests();
    },
    
    testFramework: 'mocha',

    debug: true,
  };
};
