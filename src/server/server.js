var Hapi = require("hapi");
var fs = require("fs");
var path=require("path");
var util = require('./util.js');
// Api Mock need
var http = require('http');


// load bundle information from stats
var stats = require("../../build/stats.json");

var publicPath = stats.publicPath;

var STYLE_URL = publicPath + "main.css?" + stats.hash;
var APP_URL = publicPath + [].concat(stats.assetsByChunkName.main[0])[0];
var VENDOR_URL = publicPath + [].concat(stats.assetsByChunkName.vendors)[0];
//console.log(SCRIPT_URL);
/**
 * Start Hapi server on port 8080.
 */
var server = new Hapi.Server();

server.connection({
	port: 8080
});

//fix refresh problems
server.state('UserId', {
    clearInvalid: true, // remove invalid cookies
		//isSecure: false
});
server.state('Username', {
    clearInvalid: true, // remove invalid cookies
		//isSecure: false
});
server.state('currentUserId', {
    clearInvalid: true, // remove invalid cookies
		//isSecure: false
});
server.state('UserInfo', {
    clearInvalid: false, // remove invalid cookies
		strictHeader:false,
		//isSecure: false
});

function returnIndexHtml(request,reply){
	var html = fs.readFileSync(path.resolve(__dirname, "../app/index.html"), "utf-8");
	html = html.replace('APP_URL',APP_URL);
	html = html.replace('VENDOR_URL',VENDOR_URL);
	html = html.replace('STYLE_URL',STYLE_URL);
	var res = reply(html).type("text/html");
	return res;
}

server.route({
  method: 'GET',
  path: '/{path*}',
  handler: returnIndexHtml
});

module.exports = server;

server.register(
	// {
	// 	options: {
  //       cookieOptions: {
  //           clearInvalid: true,
  //           isSecure: false
  //       }
  //   }
	// },
	[{
    register: require("./orgnization.js")
  },
	{
	  register: require("./file.js")
	},
	{
		register: require("./rank.js")
	},
	{
		register: require("./indicator.js")
	}
	],function () {
    //Start the server
    server.start(function() {
        //Log to the console the host and port info
        console.log('Server started at: ' + server.info.uri);
    });
});
