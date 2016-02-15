var webpack = require('webpack');

module.exports = function(config) {
  config.set({

    browserNoActivityTimeout: 30000,

    browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],

    singleRun: process.env.CONTINUOUS_INTEGRATION === 'true',

    frameworks: ['mocha'],

    files: [
      //'tests.webpack.js'
      'src/app/**/Regex-test.js'
    ],

    preprocessors: {
      //'tests.webpack.js': [ 'webpack', 'sourcemap' ]
      'src/app/**/Regex-test.js': ['webpack', 'sourcemap', 'coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    //reporters: [ 'dots' ],
    reporters: ['progress', 'coverage'],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        }),
        new webpack.PrefetchPlugin("react"),
        new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
      ]
    },

    webpackServer: {
      noInfo: true
    }

  });
};
