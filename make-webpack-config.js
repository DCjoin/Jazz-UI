
module.exports = function(options) {
  var path = require("path");
  var webpack = require("webpack");
  var ExtractTextPlugin = require("extract-text-webpack-plugin");
  var extractLessModule = require("./extract-less-webpack-module.js");
  var fs = require('fs');
  var modulePath = "node_modules";
  var appRoot = path.join(__dirname, "src", "app");
  var entry = {
    main: path.join(appRoot, "app.jsx"),
    vendors: "./reference.jsx"
  };

  var additionalLoaders = [
    // { test: /some-reg-exp$/, loader: "any-loader" }
  ];
  var alias = {
    config: path.join(__dirname, "src/app/config/" + options.env + ".jsx")
  };
  var aliasLoader = {

  };
  var externals = [];
  var extensions = ["", ".jsx", "html"];

  var publicPath = options.devServer ?
    "http://localhost:3000/build/" :
    "/assets/"; //"./";
  var output = {
    path: path.join(__dirname, "build", "assets"),
    publicPath: publicPath,
    filename: "bundle.js" + (options.publish ? "?[chunkhash]" : ""),
    chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.publish ? "?[chunkhash]" : ""),
    //sourceMapFilename: "debugging/[file].map",
    pathinfo: options.debug
  };
  var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
    /node_modules[\\\/]items-store[\\\/]/
  ];
  var plugins = [
    function() {
      if (!options.publish) {
        this.plugin("done", function(stats) {
          var jsonStats = stats.toJson({
            chunkModules: true,
            exclude: excludeFromStats
          });
          jsonStats.publicPath = publicPath;
          fs.writeFileSync(path.join(__dirname, "build", "stats.json"), JSON.stringify(jsonStats));
        });
      } else {
        this.plugin("done", function(stats) {
          var APP_URL = "bundle.js",
            VENDOR_URL = "vendors.js",
            STYLE_URL = "main.css"
          var html = fs.readFileSync(path.join(appRoot, "index.html"), "utf-8");
          Object.keys(stats.compilation.assets).forEach(function(item) {
            var pathAssets = "/assets/";
            if (item.indexOf(APP_URL) >= 0) {
              html = html.replace('APP_URL', pathAssets + item);
            }
            if (item.indexOf(VENDOR_URL) >= 0) {
              html = html.replace('VENDOR_URL', pathAssets + item);
            }
            if (item.indexOf(STYLE_URL) >= 0) {
              html = html.replace('STYLE_URL', pathAssets + item);
            }
          });
          var buildPath = path.join(__dirname, "build/");

          if (!fs.existsSync(buildPath)) { //check folder
            fs.mkdirSync(buildPath);
          }
          fs.writeFileSync(path.join(buildPath, "index.html"), html);
          console.log("ok");
        });

      }
    },
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
  ];


  plugins.push(new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js" + (options.publish ? "?[chunkhash]" : "")));
  //plugins.push(new webpack.optimize.CommonsChunkPlugin("zhCn","zh-cn.js"+(options.publish?"?[chunkhash]":"")));
  //plugins.push(new webpack.optimize.CommonsChunkPlugin("enUs","en-us.js"+(options.publish?"?[chunkhash]":"")));



  plugins.push(new ExtractTextPlugin("main.css" + (options.publish ? "?[contenthash]" : "")));
  plugins.push(extractLessModule.getWebpackPlugin());

  if (options.publish) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      })
    );



  }

  return {
    entry: entry,
    output: output,
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ["react-hot-loader", "babel-loader"],
          exclude: /node_modules/
        },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'file-loader?name=[name].[ext]'
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?name=[name].[ext]&limit=10000&minetype=application/font-woff"
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file-loader?name=[name].[ext]"
        }
      ]
    },
    resolve:{
			alias:alias
		},
    devtool: options.devtool,
    debug: options.debug,
    externals: externals,
    plugins: plugins,
    devServer: {
      stats: {
        colors: true,
        exclude: excludeFromStats
      }
    },

    lessLoader: {
      lessPlugins: [
        extractLessModule.getLessPlugin()
      ]
    }
  };
};
