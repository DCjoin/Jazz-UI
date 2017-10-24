var Hapi = require("hapi");
var fs = require("fs");
var path=require("path");
var util = require('./util.js');
// Api Mock need
var http = require('http');
var useragent = require('useragent');

var publicPath = 'http://localhost:3000/build/';

var STYLE_URL = publicPath + "main.css";
var APP_URL = publicPath + 'bundle.js';
var VENDOR_URL = publicPath + 'vendors.js';
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

function returnUpdateBrowserHtml(request,reply){
  var html = fs.readFileSync(path.resolve(__dirname, "../app/UpdateBrowserTip.html"), "utf-8");
  html = html.replace('APP_URL',APP_URL);
  html = html.replace('VENDOR_URL',VENDOR_URL);
  html = html.replace('STYLE_URL',STYLE_URL);
  var res = reply(html).type("text/html");
  return res;
}

var SUPPORT_LANGUAGES = {
  'zh-cn': true,
  'en-us': true,
};
var SUPPORT_BROWSERS = [
  {type: "IE", version: 11},
  {type: "Chrome", version: 50},
];

// function returnUpdateBrowserHtml(request,reply){
//   var html = fs.readFileSync(path.resolve(__dirname, "./UpdateBrowserTip.html"), "utf-8");
//   var res = reply(html).type("text/html");
//   return res;
// }


var JAZZ_UI_UMENG_CNZZ_SDK_URL = process.env.JAZZ_UI_UMENG_CNZZ_SDK_URL;
var JAZZ_WEBAPI_HOST = process.env.JAZZ_WEBAPI_HOST;

function getLang(request) {
  var lang = request.params.lang;
  if( !lang || !SUPPORT_LANGUAGES[lang] ) {
    if( request.query.langNum === '0' ) {
      lang = 'zh-cn';
    } else if( request.query.langNum === '1' ) {
      lang = 'en-us';
    } else {
      lang= 'zh-cn';
    }
  }
  return lang;
}

function verifyBrowser(user_agent) {
  var currentBrowser = useragent.parse(user_agent);
  var supportCurrentBrowser = false;
  for(var index = 0, detectOption; index < SUPPORT_BROWSERS.length ; index++ ) {
    detectOption = SUPPORT_BROWSERS[index];
    if( currentBrowser.family === detectOption.type ) {
      supportCurrentBrowser = currentBrowser.major * 1 >= detectOption.version;
    }
  } 
  return supportCurrentBrowser;
}

function returnIndexHtml(request,reply){

  if( !verifyBrowser( request.headers['user-agent'] ) ) {
    return returnUpdateBrowserHtml(request, reply);
  }

  var html = fs.readFileSync(path.resolve(__dirname, "../app/index.html"), "utf-8");

  html = html.replace('__LANG_JS__', publicPath + getLang(request) + '.js');
  html = html.replace('APP_URL',APP_URL);
  html = html.replace('VENDOR_URL',VENDOR_URL);
  html = html.replace('STYLE_URL',STYLE_URL);

  if(JAZZ_UI_UMENG_CNZZ_SDK_URL) {
    html = html.replace('__JAZZ_UI_UMENG_CNZZ_SDK_URL__', JAZZ_UI_UMENG_CNZZ_SDK_URL);
  }
  if(JAZZ_WEBAPI_HOST) {
    html = html.replace('__JAZZ_WEBAPI_HOST__', JAZZ_WEBAPI_HOST);
  }
  var res = reply(html).type("text/html");
  return res;
}

module.exports = server;

server.register(
	[
		{register: require('h2o2')},
		{register: require("./user.js")},
		{register: require("./kpi.js")},
		{register: require("./orgnization.js")},
		{register: require("./file.js")},
    {register: require("./rank.js")},
    {register: require("./analysis.js")},
    {register: require("./template.js")},
		{register: require("./diagnose.js")},
	],function () {
    server.start(function() {
        console.log('Server started at: ' + server.info.uri);
    });
});

server.route([{
  method: 'post',
  path: '/API/{path*}',
  handler: {
    proxy: {
      passThrough: true,
        // uri: 'http://sp1.test30.energymost.com/webapihost/{path}',
        uri: 'http://sp1.test36.energymost.com/webapihost/{path}',
        onResponse: function (err, res, request, reply, settings, ttl) {
            return reply(res);
        }
    }
  }
}, {
  method: 'get',
  path: '/API/{path*}',
  handler: {
    proxy: {
    	passThrough: true,
        uri: 'http://sp1.test36.energymost.com/webapihost/{path}',
        // uri: 'http://sp1.dev.energymost.com/webapihost/{path}',
        onResponse: function (err, res, request, reply, settings, ttl) {
            return reply(res);
        }
    }
  }
}]);

server.route({
  method: 'GET',
  path: '/{lang}/{path*}',
  handler: returnIndexHtml,
});

server.route({
  method: 'GET',
  path: '/',
  handler: (req, res) => {
    return res.redirect('/zh-cn/');
  },
});