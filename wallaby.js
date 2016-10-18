// Wallaby.js configuration

var wallabyWebpack = require('wallaby-webpack');
var webpack = require('webpack');
var webpackPostprocessor = wallabyWebpack({
  // webpack options

  module: {
    loaders: [
        {test: /\.(less|css)$/, loader: 'null'}
    ]
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(gif|png|less|css)$/, 'node-noop')
  ],

  externals: {
    // Use external version of React instead of rebuilding it
    "react": "React",
    "immutable":"Immutable",
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
});

module.exports = function (wallaby) {
  return {
    // set `load: false` to all source files and tests processed by webpack
    // (except external files),
    // as they should not be loaded in browser,
    // their wrapped versions will be loaded instead
    files: [
      {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},
      {pattern: 'node_modules/immutable/dist/immutable.js', instrument: false},
      {pattern: 'node_modules/chai/chai.js', instrument: false},
      {pattern: 'src/app/**/*.js*', load: false},
      {pattern: 'tests/**/*.js*', ignore: true},
      {pattern: 'src/app/**/*-test.js*', ignore: true},
    ],

    tests: [
      {pattern: 'src/app/**/*-test.js*', load: false}
    ],

    postprocessor: webpackPostprocessor,

    testFramework: 'mocha',

    compilers: {
      '**/*.js*': wallaby.compilers.babel(),
    },

    setup: function () {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
    }
  };
};
