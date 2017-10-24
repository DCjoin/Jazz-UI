//const Hapi = require("hapi");
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require("fs");
const path=require("path");
const useragent = require('useragent');

const SUPPORT_LANGUAGES = {
  'zh-cn': true,
  'en-us': true,
};
const SUPPORT_BROWSERS = [
  {type: "IE", version: 11},
  {type: "Chrome", version: 50},
];

const PORT = 80;

// var server = new Hapi.Server();
const app = express();
app.listen(PORT, () => {
  console.log('http server running on:%d' + PORT);
});
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.protocol);
  console.log(req.hostname);
  console.log(req.url);
  console.log("%j", req.headers);
  let forwardProto = req.get("x-forwarded-proto");
  let proto = forwardProto || req.protocol;
  if (/^http$/.test(proto)) {
    // console.log("enter");
    return res.redirect(301, "https://" + req.headers.host + req.url);
  }
  else {
    console.log('next');
    return next();
  }
});
app.use("/assets", express.static(__dirname + "/assets"));
// server.connection({
//   port: 80
// });

// server.register(
//   [
//     {register: require('inert')},
//   ]
//   ,function () {
//     server.start(function() {
//         console.log('Server started at: ' + server.info.uri);
//     });
// });

function returnUpdateBrowserHtml(req, res){
  return res.sendFile(path.resolve(__dirname, "./UpdateBrowserTip.html"));
}


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

  var html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf-8");

  html = html.replace('__LANG_JS__', JAZZ_STATIC_CDN + '/' + getLang(req) + '.js');

  html = html.replace(/__JAZZ_STATIC_CDN__/g, JAZZ_STATIC_CDN)
            .replace(/__JAZZ_WEBAPI_HOST__/g, JAZZ_WEBAPI_HOST);

  if(JAZZ_UI_UMENG_CNZZ_SDK_URL) {
    html = html.replace('__JAZZ_UI_UMENG_CNZZ_SDK_URL__', JAZZ_UI_UMENG_CNZZ_SDK_URL);
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

// server.register({
//   register: require('hapi-require-https'),
//   options: {}
// })

app.get('/download-app', returnDownloadHtml);
app.get('/:lang/*', returnIndexHtml);

app.get('/', (req, res) => {
    return res.redirect(301, '/zh-cn/');
});
