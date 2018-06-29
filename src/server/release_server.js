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
const SUPPORT_BROWSERS = [
  {type: "IE", version: 11},
  {type: "Chrome", version: 50},
];

const PORT = 80;

// var server = new Hapi.Server();
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

  //add modified reg for validated host
  let host = req.host;
  let reg = /^(.*\.energymost.com)$/;
  let trust = reg.test(host);
  if(!trust) {
    res.send(404,'Page Not Found!');
    return res;
  }

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
var JAZZ_WEB_HOST = process.env.JAZZ_WEB_HOST;
var GUARD_UI_HOST = process.env.GUARD_UI_HOST;
var APIBasePath='/api';

let version = fs.readFileSync(path.resolve(__dirname, "./version.txt"), "utf-8");
console.log("version:" + version);

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

  html = html.replace('__LANG_JS__', JAZZ_STATIC_CDN + '/' + version + '/' + getLang(req) + '.js');

  html = html.replace(/__JAZZ_STATIC_CDN__/g, JAZZ_STATIC_CDN + '/' + version)
            .replace(/__JAZZ_WEBAPI_HOST__/g, JAZZ_WEBAPI_HOST)
            .replace(/__GUARD_UI_HOST__/g, GUARD_UI_HOST);

  if(JAZZ_UI_UMENG_CNZZ_SDK_URL) {
    html = html.replace('__JAZZ_UI_UMENG_CNZZ_SDK_URL__', JAZZ_UI_UMENG_CNZZ_SDK_URL);
  }
  return res.status(200).type('.html').end(html);
}

function returnDownloadHtml(req, res){
  var html = fs.readFileSync(path.resolve(__dirname, "./DownloadApp.html"), "utf-8")
                .replace(/__JAZZ_STATIC_CDN__/g, JAZZ_STATIC_CDN + '/' + version)
                .replace('${APP_VERSION}', APP_VERSION)
                .replace('${APP_SIZE}', APP_SIZE)
                .replace('${APP_DOWNLOAD_LOCAL}', APP_DOWNLOAD_LOCAL)
                .replace('${APP_DOWNLOAD_QQ}', APP_DOWNLOAD_QQ)
                .replace('${APP_DOWNLOAD_WDJ}', APP_DOWNLOAD_WDJ)
                .replace('${APP_DOWNLOAD_BAIDU}', APP_DOWNLOAD_BAIDU)
                .replace('${JAZZ_UI_API_BASE_PATH}',JAZZ_WEBAPI_HOST+APIBasePath);
  return res.status(200).type('.html').end(html);
}

// server.register({
//   register: require('hapi-require-https'),
//   options: {}
// })

app.get('/download-app', returnDownloadHtml);

// Release the metadata publicly
app.get('/sso/metadata', (req, res) => res.header('Content-Type','text/xml').send(sp.getMetadata()));

// Access URL for implementing SP-init SSO

app.get('/:lang/spinitsso-redirect', (req, res) => {
  let acsURL = new URL(req.query.callbackURL);
  // Configure your endpoint for IdP-initiated / SP-initiated SSO

  const sp = ServiceProvider({
    privateKey: fs.readFileSync(__dirname + '/SE-SP.pem'),
    privateKeyPass: 'sesp!@#',
    requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',

    metadata: fs.readFileSync(__dirname + '/metadata_sp.xml', "utf-8").replace('${SSO_ACS_URL}', acsURL.origin +'/'+ req.params.lang+ "/sso/acs")

  });

  const idp = IdentityProvider({
    metadata: fs.readFileSync(__dirname + '/onelogin_metadata.xml', "utf-8").split('${GUARD_UI_HOST}').join(GUARD_UI_HOST + "Saml/SignOnService")
  });


  const url = sp.createLoginRequest(idp, 'redirect');

  const redirectURL = new URL(url.context);

  redirectURL.pathname = req.params.lang + redirectURL.pathname;
  console.log(redirectURL.pathname);
  let spDomain = req.hostname.split(".")[0] ? req.hostname.split(".")[0] : "";
  // spDomain=spDomain==='dev'?'sp1':spDomain;
  //因为sso的dev环境存在问题，暂时都指向sp1环境
  // let spDomain = 'sp1';
  console.log(spDomain);
  console.log(redirectURL.href);

  return res.redirect(redirectURL.href + "&callbackURL=" + encodeURIComponent(req.query.callbackURL) + "&sysId=" + SYSID + "&spDomain=" + encodeURIComponent(spDomain));
});

app.get('/:lang/sso-redirect-hierarchy/:customerId', (req, res) => {
  let acsURL = new URL(req.query.callbackURL);
  // Configure your endpoint for IdP-initiated / SP-initiated SSO
  let parObj = {
    sysId: 0,// 0云能效 1千里眼 2灯塔 8万丈云
    Menu: "hierarchy",
    CustomerId: req.params.customerId // 当前CustomerId
  };
  let parStr = encodeURIComponent(JSON.stringify(parObj));

  const sp = ServiceProvider({
    privateKey: fs.readFileSync(__dirname + '/SE-SP.pem'),
    privateKeyPass: 'sesp!@#',
    requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',

    metadata: fs.readFileSync(__dirname + '/metadata_sp.xml', "utf-8").replace('${SSO_ACS_URL}', 'https://emop-test.energymost.com' +'/'+ req.params.lang+ "/sso/acs"+"?par=" + parStr)

  });

  const idp = IdentityProvider({
    metadata: fs.readFileSync(__dirname + '/onelogin_metadata.xml', "utf-8").split('${GUARD_UI_HOST}').join(GUARD_UI_HOST + "Saml/SignOnService")
  });


  const url = sp.createLoginRequest(idp, 'redirect');

  const redirectURL = new URL(url.context);

  redirectURL.pathname = req.params.lang + redirectURL.pathname;
  console.log(redirectURL.pathname);
  let spDomain = req.hostname.split(".")[0] ? req.hostname.split(".")[0] : "";
  // spDomain=spDomain==='dev'?'sp1':spDomain;
  //因为sso的dev环境存在问题，暂时都指向sp1环境
  // let spDomain = 'sp1';
  console.log(spDomain);
  console.log(redirectURL.href);

  return res.redirect(redirectURL.href + "&callbackURL=" + encodeURIComponent(req.query.callbackURL) + "&sysId=" + SYSID + "&spDomain=" + encodeURIComponent(spDomain));
})

// This is the assertion service url where SAML Response is sent to
app.post('/:lang/sso/acs', (req, res) => {
  console.log("get assertion and return to Jazz backend!");
  console.log(req);
  console.log(req.params.lang);
  console.log(res);
  var id = Math.ceil(Math.random()*100000) + "" + Date.now();
  acsObj[id] = req.body.SAMLResponse;
  res.cookie('AssertId', id).redirect(301, `/${req.params.lang}/saml`);
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
  return res.redirect(GUARD_UI_HOST + req.params.lang + "/logout?returnURL=" + encodeURIComponent(req.query.returnURL+'/'+req.params.lang+'/'));
});

app.get('/:lang/*', returnIndexHtml);

app.get('/', (req, res) => {
    return res.redirect(301, '/zh-cn/');
});
