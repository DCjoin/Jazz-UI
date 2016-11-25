var path = require('path');
module.exports = {
    resolve:{
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
		},
	},
	module: {
		loaders: [{
				test: /\.jsx?$/,
				loaders: ['react-hot-loader', 'babel-loader'],
				exclude: /node_modules/
			},
		],
	},
};