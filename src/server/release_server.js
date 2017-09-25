var Hapi = require("hapi");
var fs = require("fs");
var path=require("path");
var useragent = require('useragent');

var SUPPORT_LANGUAGES = {
  'zh-cn': true,
  'en-us': true,
};
var SUPPORT_BROWSERS = [
  {type: "IE", version: 11},
  {type: "Chrome", version: 50},
];

var server = new Hapi.Server();

server.connection({
  port: 80
});
server.register(
  [
    {register: require('inert')},
  ]
  ,function () {
    server.start(function() {
        console.log('Server started at: ' + server.info.uri);
    });
});

function returnUpdateBrowserHtml(request,reply){
  var html = fs.readFileSync(path.resolve(__dirname, "./UpdateBrowserTip.html"), "utf-8");
  var res = reply(html).type("text/html");
  return res;
}


var JAZZ_UI_UMENG_CNZZ_SDK_URL = process.env.JAZZ_UI_UMENG_CNZZ_SDK_URL;
var JAZZ_WEBAPI_HOST = process.env.JAZZ_WEBAPI_HOST;
var JAZZ_STATIC_CDN = process.env.JAZZ_STATIC_CDN;

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

  var html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf-8");

  html = html.replace('__LANG_JS__', '/assets/' + getLang(request) + '.js');

  html = html.replace('__JAZZ_STATIC_CDN__', __JAZZ_STATIC_CDN__)
            .replace('__JAZZ_WEBAPI_HOST__', JAZZ_WEBAPI_HOST);

  if(JAZZ_UI_UMENG_CNZZ_SDK_URL) {
    html = html.replace('__JAZZ_UI_UMENG_CNZZ_SDK_URL__', JAZZ_UI_UMENG_CNZZ_SDK_URL);
  }
  var res = reply(html).type("text/html");
  return res;
}

function returnDownloadHtml(request,reply){
  var html = fs.readFileSync(path.resolve(__dirname, "./DownloadApp.html"), "utf-8");
  var res = reply(html).type("text/html");
  return res;
}


// server.route({
//   method: 'GET',
//   path: '/assets/{files*}',
//   handler: {
//     directory: { 
//       path: './build/assets'
//     }
//   }
// });
server.route({
  method: 'GET',
  path: '/DownloadApp.html',
  handler: returnDownloadHtml,
});
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

module.exports = server;
