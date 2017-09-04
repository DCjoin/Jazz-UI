var Hapi = require("hapi");
var fs = require("fs");
var path=require("path");

/**
 * Start Hapi server on port 8080.
 */
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
var JAZZ_WEBAPI_HOST = process.env.JAZZ_WEBAPI_HOST;//'http://sp1.energymost.com';//
function returnIndexHtml(request,reply){
  var html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf-8");

  if(JAZZ_UI_UMENG_CNZZ_SDK_URL) {
    html = html.replace('${JAZZ_UI_UMENG_CNZZ_SDK_URL}', JAZZ_UI_UMENG_CNZZ_SDK_URL);
  }
  if(JAZZ_WEBAPI_HOST) {
    html = html.replace('${JAZZ_WEBAPI_HOST}', JAZZ_WEBAPI_HOST);
  }
  var res = reply(html).type("text/html");
  return res;
}


server.route({
  method: 'GET',
  path: '/assets/{files*}',
  handler: {
    directory: { 
      path: './build/assets'
    }
  }
});
server.route({
  method: 'GET',
  path: '/need-to-update-browser',
  handler: returnUpdateBrowserHtml
});
server.route({
  method: 'GET',
  path: '/{path*}',
  handler: returnIndexHtml,
});

module.exports = server;
