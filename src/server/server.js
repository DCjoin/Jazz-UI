// var Hapi = require("hapi");
const express = require('express');
const cookieParser = require('cookie-parser');
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
// var server = new Hapi.Server();

// server.connection({
// 	port: 8080
// });

// //fix refresh problems
// server.state('UserId', {
//     clearInvalid: true, // remove invalid cookies
// 		//isSecure: false
// });
// server.state('Username', {
//     clearInvalid: true, // remove invalid cookies
// 		//isSecure: false
// });
// server.state('currentUserId', {
//     clearInvalid: true, // remove invalid cookies
// 		//isSecure: false
// });
// server.state('UserInfo', {
//     clearInvalid: false, // remove invalid cookies
// 		strictHeader:false,
// 		//isSecure: false
// });

const PORT = 8080;
const app = express();
app.listen(PORT, () => {
  console.log('http server running on:%d' + PORT);
});
app.use(cookieParser());
app.get('/download-app', returnDownloadHtml);
app.get('/:lang/*', returnIndexHtml);

app.get('/', (req, res) => {
    return res.redirect(301, '/zh-cn/');
});


function returnUpdateBrowserHtml(req, res){
  return res.sendFile(path.resolve(__dirname, "./UpdateBrowserTip.html"));
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
var JAZZ_STATIC_CDN = process.env.JAZZ_STATIC_CDN;
var APP_VERSION = process.env.APP_VERSION;
var APP_SIZE = process.env.APP_SIZE;
var APP_DOWNLOAD_LOCAL = process.env.APP_DOWNLOAD_LOCAL;
var APP_DOWNLOAD_QQ = process.env.APP_DOWNLOAD_QQ;
var APP_DOWNLOAD_WDJ = process.env.APP_DOWNLOAD_WDJ;
var APP_DOWNLOAD_BAIDU = process.env.APP_DOWNLOAD_BAIDU;

function getLang(req) {
  var lang = req.params.lang;
  if( !lang || !SUPPORT_LANGUAGES[lang] ) {
    if( req.query.langNum === '0' ) {
      lang = 'zh-cn';
    } else if( req.query.langNum === '1' ) {
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

function returnIndexHtml(req,res){

  if( !req.cookies.skip_detect && !verifyBrowser( req.get('user-agent') ) ) {
    return returnUpdateBrowserHtml(req, res);
  }

  var html = fs.readFileSync(path.resolve(__dirname, "../app/index.html"), "utf-8");

  html = html.replace('__LANG_JS__', publicPath + getLang(req) + '.js');
  html = html.replace('APP_URL',APP_URL);
  html = html.replace('VENDOR_URL',VENDOR_URL);
  html = html.replace('STYLE_URL',STYLE_URL);

  if(JAZZ_UI_UMENG_CNZZ_SDK_URL) {
    html = html.replace('__JAZZ_UI_UMENG_CNZZ_SDK_URL__', JAZZ_UI_UMENG_CNZZ_SDK_URL);
  }
  if(JAZZ_WEBAPI_HOST) {
    html = html.replace('__JAZZ_WEBAPI_HOST__', JAZZ_WEBAPI_HOST);
  }
  return res.status(200).type('.html').end(html);
}

function returnDownloadHtml(req, res){
  var html = fs.readFileSync(path.resolve(__dirname, "./DownloadApp.html"), "utf-8")
                .replace(/__JAZZ_STATIC_CDN__/g, JAZZ_STATIC_CDN)
                .replace('${APP_VERSION}', APP_VERSION)
                .replace('${APP_SIZE}', APP_SIZE)
                .replace('${APP_DOWNLOAD_LOCAL}', APP_DOWNLOAD_LOCAL)
                .replace('${APP_DOWNLOAD_QQ}', APP_DOWNLOAD_QQ)
                .replace('${APP_DOWNLOAD_WDJ}', APP_DOWNLOAD_WDJ)
                .replace('${APP_DOWNLOAD_BAIDU}', APP_DOWNLOAD_BAIDU);
  return res.status(200).type('.html').end(html);
}
// server.register(
// 	[
// 		{register: require('h2o2')},
// 		{register: require("./user.js")},
// 		{register: require("./kpi.js")},
// 		{register: require("./orgnization.js")},
// 		{register: require("./file.js")},
//     {register: require("./rank.js")},
//     {register: require("./analysis.js")},
//     {register: require("./template.js")},
// 		{register: require("./diagnose.js")},
// 	],function () {
//     server.start(function() {
//         console.log('Server started at: ' + server.info.uri);
//     });
// });

// server.route([{
//   method: 'post',
//   path: '/API/{path*}',
//   handler: {
//     proxy: {
//       passThrough: true,
//         // uri: 'http://sp1.test30.energymost.com/webapihost/{path}',
//         uri: 'http://sp1.test36.energymost.com/webapihost/{path}',
//         onResponse: function (err, res, request, reply, settings, ttl) {
//             return reply(res);
//         }
//     }
//   }
// }, {
//   method: 'get',
//   path: '/API/{path*}',
//   handler: {
//     proxy: {
//     	passThrough: true,
//         uri: 'http://sp1.test36.energymost.com/webapihost/{path}',
//         // uri: 'http://sp1.dev.energymost.com/webapihost/{path}',
//         onResponse: function (err, res, request, reply, settings, ttl) {
//             return reply(res);
//         }
//     }
//   }
// }]);

// server.route({
//   method: 'GET',
//   path: '/{lang}/{path*}',
//   handler: returnIndexHtml,
// });

// server.route({
//   method: 'GET',
//   path: '/',
//   handler: (req, res) => {
//     return res.redirect('/zh-cn/');
//   },
// });
