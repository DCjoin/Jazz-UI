var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {

	target: 'node',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
        alias: {
            stores: path.join(__dirname, 'src/app/stores'),
			config: path.join(__dirname, 'src/app/config/local.jsx'),
			actions: path.join(__dirname, 'src/app/actions/'),
			stores: path.join(__dirname, 'src/app/stores/'),
			controls: path.join(__dirname, 'src/app/controls/'),
			util: path.join(__dirname, 'src/app/util/'),
			constants: path.join(__dirname, 'src/app/constants/'),
			dispatcher: path.join(__dirname, 'src/app/dispatcher/'),
			mockData: path.join(__dirname, 'mockData/'),
			components: path.join(__dirname, "src/app/components/"),
        }
    },
	externals: [nodeExternals()],
    devtool: "cheap-module-source-map",
	module: {
		loaders: [{
			test: /\.ts$/,
			loader: "babel-loader!ts-loader",
			exclude: /node_modules/
		}, {
			test: /\.jsx$/,
			loader: "babel-loader",
			exclude: /node_modules/
		},
        {
          test: /\.less$/,
          loader: "null-loader"
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: "null-loader"
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "null-loader"
        }],
	},
};
