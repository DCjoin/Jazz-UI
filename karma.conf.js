const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'Chrome' ],
    files: [
      'tests.webpack.js'
    ],
    port: 8000,
    captureTimeout: 60000,
    frameworks: ['mocha'],
    singleRun: true,
    reporters:['progress','coverage'],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: {
      devtool: 'eval',
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        babel: {
            presets: ['es2015', 'stage-0', 'react']
        }
      },
      module: {
        preLoaders: [
          {
            test: /\.(js|jsx)$/,
            loader: 'isparta',
            include: [
              path.join(__dirname, './src/app')
            ]
          }
        ],
        loaders: [
          {
            test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl|json)$/,
            loader: 'null-loader'
          },
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
          }
        ]
      },
      resolve: {
        alias: {
            stores: path.join(__dirname, 'src/app/stores'),
            dispatcher: path.join(__dirname, 'src/app/dispatcher'),
            constants: path.join(__dirname, 'src/app/constants'),
            config: path.join(__dirname, 'src/app/config/test.jsx')
        }
      },
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    },
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      dir: 'coverage/',
      includeAllSources: true,
      instrumenterOptions: {
        istanbul: { noCompact: true }
      },
      reporters: [
        { type: 'html', subdir: '.'},
        { type: 'text' },
        {type: 'text-summary'},
        {type: 'cobertura', subdir: '.'}
      ]
    },
    plugins: [
        'karma-mocha',
        'karma-webpack',
        'karma-coverage',
        'karma-sourcemap-loader',
        'karma-chrome-launcher',
    ]
  });
};
