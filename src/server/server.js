const express = require('express');
const cookieParser = require('cookie-parser');
// var request = require("request");
var fs = require("fs");
var path = require("path");
const { URL } = require('url');
const SYSID = 0;// 0云能效 1千里眼 2灯塔 8万丈云
var util = require('./util.js');
// Api Mock need
var http = require('http');
var useragent = require('useragent');
var acsObj = {};

var publicPath = 'http://localhost:3000/build/';

var STYLE_URL = publicPath + "main.css";
var APP_URL = publicPath + 'bundle.js';
var VENDOR_URL = publicPath + 'vendors.js';

const PORT = 8080;
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
app.get('/download-app', returnDownloadHtml);

// Release the metadata publicly
app.get('/sso/metadata', (req, res) => res.header('Content-Type','text/xml').send(sp.getMetadata()));

// Access URL for implementing SP-init SSO
app.get('/:lang/spinitsso-redirect',(req, res) => {
  // Configure your endpoint for IdP-initiated / SP-initiated SSO

  console.log(__dirname);
  console.log(req);

  const sp = ServiceProvider({
    privateKey: fs.readFileSync(__dirname + '/SE-SP.pem'),
    privateKeyPass: 'sesp!@#',
    requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    metadata: fs.readFileSync(__dirname + '/metadata_sp.xml', "utf-8").replace('${SSO_ACS_URL}', "http://localhost:8080/sso/acs")
  });

  const idp = IdentityProvider({
    metadata: fs.readFileSync(__dirname + '/onelogin_metadata.xml', "utf-8").split('${GUARD_UI_HOST}').join("http://passport-test.energymost.com/Saml/SignOnService")
  });

  const url = sp.createLoginRequest(idp, 'redirect');  
  const redirectURL = new URL(url.context);  
  redirectURL.pathname = req.params.lang + redirectURL.pathname;
  // let spDomain = req.hostname.split(".")[0] ? req.hostname.split(".")[0] : "";

  let spDomain='sp1';
  return res.redirect(redirectURL.href + "&callbackURL=" + encodeURIComponent(req.query.callbackURL) + "&sysId=" + SYSID + "&spDomain=" + encodeURIComponent(spDomain));
});

// This is the assertion service url where SAML Response is sent to
app.post('/sso/acs', (req, res) => {
  console.log("get assertion and return to Jazz backend!");
  // console.log(req.body);
  var id = Math.ceil(Math.random()*100000) + "" + Date.now();
  acsObj[id] = req.body.SAMLResponse;
  res.cookie('AssertId', id)
    .redirect(301, '/zh-cn/saml');  

  // get assertion and return to Jazz backend
  // var options = {
  //   url: 'http://web-api-test.energymost.com/API/AccessControl/ValidateUser', 
  //   formData: req.body, 
  //   proxy: 'http://10.198.157.120:9400'// noNeed4prod
  // };
  // request.post(options, function optionalCallback(err, httpResponse, body) {
  //   if(err) {
  //     return console.error('upload failed:', err);
  //   } else {
  //     console.log(body)
  //     let _body = JSON.parse(body);
  //     if(_body && _body.error.Code === '0') {
  //       // console.log(_body.Result.Id);
  //       // console.log(_body.Result.Token);
  //       console.log(httpResponse.headers['set-cookie'][0]);
  //       res
  //         .set({
  //           'Set-Cookie': httpResponse.headers['set-cookie'][0],
  //           'withCredentials': 'true'
  //         })
  //         // .cookie('ASPXAUTH', httpResponse.headers['set-cookie'][0])
  //         .cookie('UserId', _body.Result.Id)
  //         .cookie("AuthLoginToken", _body.Result.Token)
  //         .cookie('SkipLogin', 'true')
  //         .redirect(301, '/zh-cn/');
  //     } else {
  //       console.log("fail!"); 
  //       res.redirect(301, '/zh-cn/login');
  //     }
  //   }    
  // });
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
  return res.redirect("http://localhost:8081/" + req.params.lang + "/logout?returnURL=" + encodeURIComponent(req.query.returnURL));
});


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
