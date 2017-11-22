// var Hapi = require("hapi");
// var fs = require("fs");
// var path=require("path");
// var useragent = require('useragent');

// var SUPPORT_LANGUAGES = {
//const Hapi = require("hapi");
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require("fs");
const path=require("path");
const useragent = require('useragent');
var acsObj = {};

// var request = require("request");
const { URL } = require('url');
const SYSID = 0;// 0云能效 1千里眼 2灯塔 8万丈云

const SUPPORT_LANGUAGES = {
  'zh-cn': true,
  'en-us': true,
};
var SUPPORT_BROWSERS = [
  {type: "IE", version: 11},
  {type: "Chrome", version: 50},
];

// var server = new Hapi.Server();


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

// var server = new Hapi.Server();
const PORT = 80;
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const saml = require('samlify');
const ServiceProvider = saml.ServiceProvider;
const IdentityProvider = saml.IdentityProvider;

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
  console.log(forwardProto);
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

function returnUpdateBrowserHtml(request,reply){
  var html = fs.readFileSync(path.resolve(__dirname, "./UpdateBrowserTip.html"), "utf-8");
  var res = reply(html).type("text/html");
  return res;
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
var JAZZ_WEB_HOST = process.env.JAZZ_WEB_HOST;
var GUARD_UI_HOST = process.env.GUARD_UI_HOST;

let version = fs.readFileSync(path.resolve(__dirname, "./version.txt"), "utf-8");
console.log("version:" + version);

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

function returnIndexHtml(req,res){
  if( !req.cookies.skip_detect && !verifyBrowser( req.get('user-agent') ) ) {
    return returnUpdateBrowserHtml(req, res);
  }

  var html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf-8");

  // html = html.replace('__LANG_JS__', cdn + '/' + getLang(request) + '.js');

  // html = html.replace(/__JAZZ_STATIC_CDN__/g, cdn)
  html = html.replace('__LANG_JS__', JAZZ_STATIC_CDN + '/' + version + '/' + getLang(req) + '.js');

  html = html.replace(/__JAZZ_STATIC_CDN__/g, JAZZ_STATIC_CDN + '/' + version)
            .replace(/__JAZZ_WEBAPI_HOST__/g, JAZZ_WEBAPI_HOST);

  if(JAZZ_UI_UMENG_CNZZ_SDK_URL) {
    html = html.replace('__JAZZ_UI_UMENG_CNZZ_SDK_URL__', JAZZ_UI_UMENG_CNZZ_SDK_URL);
  }
  var res = reply(html).type("text/html");
  return res;
}

function returnDownloadHtml(request,reply){
  var html = fs.readFileSync(path.resolve(__dirname, "./DownloadApp.html"), "utf-8")
                // .replace(/__JAZZ_STATIC_CDN__/g, cdn)
                .replace(/__JAZZ_STATIC_CDN__/g, JAZZ_STATIC_CDN + '/' + version)
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


// server.route({
//   method: 'GET',
//   path: '/DownloadApp.html',
//   handler: returnDownloadHtml,
// });
// server.route({
//   method: 'GET',
//   path: '/download-app',
//   handler: returnDownloadHtml,
// });
// server.route({
//   method: 'GET',
//   path: '/{lang}/{path*}',
//   handler: returnIndexHtml,
// });

app.get('/download-app', returnDownloadHtml);

// Release the metadata publicly
app.get('/sso/metadata', (req, res) => res.header('Content-Type','text/xml').send(sp.getMetadata()));

// Access URL for implementing SP-init SSO
app.get('/:lang/spinitsso-redirect', (req, res) => {
  // Configure your endpoint for IdP-initiated / SP-initiated SSO
  const sp = ServiceProvider({
    privateKey: fs.readFileSync(__dirname + '/SE-SP.pem'),
    privateKeyPass: 'sesp!@#',
    requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    metadata: fs.readFileSync(__dirname + '/metadata_sp.xml', "utf-8").replace('${SSO_ACS_URL}', JAZZ_WEB_HOST + "/sso/acs")
  });

  const idp = IdentityProvider({
    metadata: fs.readFileSync(__dirname + '/onelogin_metadata.xml', "utf-8").split('${GUARD_UI_HOST}').join(GUARD_UI_HOST + "Saml/SignOnService")
  });

  const url = sp.createLoginRequest(idp, 'redirect');  
  const redirectURL = new URL(url.context);  
  redirectURL.pathname = req.params.lang + redirectURL.pathname;
  let spDomain = req.hostname.split(".")[0] ? req.hostname.split(".")[0] : "";
  return res.redirect(redirectURL.href + "&callbackURL=" + encodeURIComponent(req.query.callbackURL) + "&sysId=" + SYSID + "&spDomain=" + encodeURIComponent(spDomain));
});

// This is the assertion service url where SAML Response is sent to
app.post('/sso/acs', (req, res) => {
  console.log("get assertion and return to Jazz backend!");
  var id = Math.ceil(Math.random()*100000) + "" + Date.now();
  acsObj[id] = req.body.SAMLResponse;
  res.cookie('AssertId', id).redirect(301, '/zh-cn/saml');  
});

app.get("/saml/acs", (req, res) => {
  let result = acsObj[req.query.id];
  if(result) {
    res.send({result: {SAMLResponse: result}});
    delete acsObj[req.query.id];
  } else {
    res.send({result: {SAMLResponse: null}});
  }
});

app.get('/:lang/logout',(req, res) => {
  return res.redirect(GUARD_UI_HOST + req.params.lang + "/logout?returnURL=" + encodeURIComponent(req.query.returnURL));
});

app.get('/:lang/*', returnIndexHtml);

app.get('/', (req, res) => {
    return res.redirect(301, '/zh-cn/');
});

// module.exports = server;
