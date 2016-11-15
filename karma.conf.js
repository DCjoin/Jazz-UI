const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'Chrome' ],
    files: [
      'test/__tests__/**.ts'
    ],
    port: 8000,
    captureTimeout: 60000,
    frameworks: ['mocha'],
    singleRun: false,
    reporters:['progress','coverage'],
    preprocessors: {
      'test/__tests__/**.ts': [ 'webpack', 'sourcemap' ]
    },
    webpack: require()
    // webpackServer: {
    //   noInfo: true
    // },
    // coverageReporter: {
    //   dir: 'coverage/',
    //   includeAllSources: true,
    //   instrumenterOptions: {
    //     istanbul: { noCompact: true }
    //   },
    //   reporters: [
    //     { type: 'html', subdir: '.'},
    //     { type: 'text' },
    //     {type: 'text-summary'},
    //     {type: 'cobertura', subdir: '.'}
    //   ]
    // }
  });
};
