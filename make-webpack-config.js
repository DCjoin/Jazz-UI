
module.exports = function(options) {
  var path = require("path");
  var webpack = require("webpack");
  var ExtractTextPlugin = require("extract-text-webpack-plugin");
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  var CopyWebpackPlugin = require('copy-webpack-plugin');
  var extractLessModule = require("./extract-less-webpack-module.js");
  var fs = require('fs');
  var modulePath = "node_modules";
  var appRoot = path.join(__dirname, "src", "app");
  var entry = {
    bundle: path.join(appRoot, "app.jsx"),
    // vendors: ['react']
    vendors: "./reference.jsx",
    // "en-us": path.join(__dirname, "src", "app", "lang", 'en-us'),
    // "zh-cn": path.join(__dirname, "src", "app", "lang", 'zh-cn'),
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
    "__JAZZ_STATIC_CDN__/";//"/assets/";
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
          // var jsonStats = stats.toJson({
          //   chunkModules: true,
          //   exclude: excludeFromStats
          // });
          // jsonStats.publicPath = publicPath;
          // fs.writeFileSync(path.join(__dirname, "stats.json"), stats);
        });
      } else {
        this.plugin("done", function(stats) {
          var buildPath = path.join(__dirname, "build/");

          if (!fs.existsSync(buildPath)) { //check folder
            fs.mkdirSync(buildPath);
          }
          fs.writeFileSync(path.join(buildPath,"UpdateBrowserTip.html"), fs.readFileSync(path.join(appRoot, "UpdateBrowserTip.html"), "utf-8"));

          (function(){
            var assetsPath = "/assets/";
            var html = fs.readFileSync(path.join(appRoot, "DownloadApp.html"), "utf-8");
            html = html.replace(/FAVICON_ICON/g,assetsPath + 'favicon.png');
            html = html.replace(/PUBLIC_PATH/g,publicPath);
            // for app download
            if (process.env["APP_VERSION"]) {
              let APP_VERSION = process.env["APP_VERSION"];
              html = html.replace('${APP_VERSION}', APP_VERSION); 
            }
            if (process.env["APP_SIZE"]) {
              let APP_SIZE = process.env["APP_SIZE"];
              html = html.replace('${APP_SIZE}', APP_SIZE); 
            }
            if (process.env["APP_DOWNLOAD_LOCAL"]) {
              let APP_DOWNLOAD_LOCAL = process.env["APP_DOWNLOAD_LOCAL"];
              html = html.replace('${APP_DOWNLOAD_LOCAL}', APP_DOWNLOAD_LOCAL); 
            }
            if (process.env["APP_DOWNLOAD_QQ"]) {
              let APP_DOWNLOAD_QQ = process.env["APP_DOWNLOAD_QQ"];
              html = html.replace('${APP_DOWNLOAD_QQ}', APP_DOWNLOAD_QQ); 
            }
            if (process.env["APP_DOWNLOAD_WDJ"]) {
              let APP_DOWNLOAD_WDJ = process.env["APP_DOWNLOAD_WDJ"];
              html = html.replace('${APP_DOWNLOAD_WDJ}', APP_DOWNLOAD_WDJ); 
            }
            if (process.env["APP_DOWNLOAD_BAIDU"]) {
              let APP_DOWNLOAD_BAIDU = process.env["APP_DOWNLOAD_BAIDU"];
              html = html.replace('${APP_DOWNLOAD_BAIDU}', APP_DOWNLOAD_BAIDU); 
            }
            fs.writeFileSync(path.join(buildPath,"DownloadApp.html"), html);
          })();

          console.log("ok");
        });

      }
    },
    new webpack.PrefetchPlugin("react"),
    new HtmlWebpackPlugin({      
      template: './src/app/template.html',
      filename: '../index.html',
      favicon: './src/app/favicon.ico',
      hash: true,
      cache: true
    }),
    new CopyWebpackPlugin([{
      context: 'src/app/lang',
      from: '*.js',
    }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      fiulename: "vendors.js" + (options.publish ? "?[chunkhash]" : "")
    }),
    new ExtractTextPlugin({
      filename: "main.css" + (options.publish ? "?[contenthash]" : "")
    }),
    extractLessModule.getWebpackPlugin(),
  ];
  if (options.publish) {
    plugins.push(
      // new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: true
        }
      }),
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
          use: [ "babel-loader"],
          exclude: [
            /node_modules/,
            path.join(__dirname, "src", "app", "lang", "*.js")
          ]
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
