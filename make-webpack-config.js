
module.exports = function(options) {
  var path = require("path");
  var webpack = require("webpack");
  var ExtractTextPlugin = require("extract-text-webpack-plugin");
  var extractLessModule = require("./extract-less-webpack-module.js");
  var fs = require('fs');
  var modulePath = "node_modules";
  var appRoot = path.join(__dirname, "src", "app");
  var entry = {
    bundle: path.join(appRoot, "app.jsx"),
    // vendors: ['react']
    vendors: "./reference.jsx"
  };

  var alias = {
    config: path.join(__dirname, "src/app/config/" + options.env + ".jsx"),
    actions: path.join(__dirname, "src/app/actions/"),
    stores: path.join(__dirname, "src/app/stores/"),
    controls: path.join(__dirname, "src/app/controls/"),
    util: path.join(__dirname, "src/app/util/"),
    constants: path.join(__dirname, "src/app/constants/"),
    components: path.join(__dirname, "src/app/components/"),
    decorator: path.join(__dirname, "src/app/decorator/"),
  };
  var aliasLoader = {

  };
  var externals = [];
  var extensions = ["", ".jsx", "html"];

  var publicPath = options.devServer ?
    "http://localhost:3000/build/" :
    "/webapihost/assets/"; 
  var output = {
    path: path.join(__dirname, "build", "assets"),
    publicPath: publicPath,
    filename: "[name].js" + (options.publish ? "?[chunkhash]" : ""),
    // filename: "bundle.js" + (options.publish ? "?[chunkhash]" : ""),
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
          fs.writeFileSync(path.join(buildPath,"UpdateBrowserTip.html"), fs.readFileSync(path.join(appRoot, "UpdateBrowserTip.html"), "utf-8"));
          console.log("ok");
        });

      }
    },
    new webpack.PrefetchPlugin("react"),
  ];
  plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: "vendors", 
    fiulename: "vendors.js" + (options.publish ? "?[chunkhash]" : "")
  }));
  plugins.push(new ExtractTextPlugin({
    filename: "main.css" + (options.publish ? "?[contenthash]" : "")
  }));
  plugins.push(extractLessModule.getWebpackPlugin());
  if (options.publish) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      })
    );
  } else {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        debug: true
      })
    );
  }

  return {
    entry: entry,
    output: output,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [/*"react-hot-loader", */"babel-loader"],
          exclude: /node_modules/
        },
        {
          test: /\.less$/,
          loaders: ExtractTextPlugin.extract({
            fallback: "style-loader",
            // use: 'css-loader?less-loader'
            use: [
              {
                loader: "css-loader"
              }, 
              {
                loader: "less-loader",
                options: {
                  plugins: [
                    extractLessModule.getLessPlugin()
                  ]
                }
              }],
          }),
          // loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader",
          }),
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: 'file-loader?name=[name].[ext]'
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "url-loader?name=[name].[ext]&limit=10000&minetype=application/font-woff"
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "file-loader?name=[name].[ext]"
        }
      ]
    },
    resolve:{
			alias:alias
		},
    devtool: options.devtool,
    // debug: options.debug,
    externals: externals,
    plugins: plugins,
    devServer: {
      stats: {
        colors: true,
        exclude: excludeFromStats
      }
    },

    // lessLoader: {
    //   lessPlugins: [
    //     extractLessModule.getLessPlugin()
    //   ]
    // }
  };
};
