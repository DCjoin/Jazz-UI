var co = require('co');
var OSS = require('ali-oss')
var path = require("path");
var fs = require("fs");

var region = process.env["OSS_REGION"];
var accessKeyId = process.env["ALI_SDK_STS_ID"];
var accessKeySecret = process.env["ALI_SDK_STS_SECRET"];
var bucket = process.env["OSS_BUCKET"];

if(!region || !accessKeyId || !accessKeySecret || !bucket){
  console.error("ERROR:environment not set");
  console.error("Please set environment variable: OSS_REGION,ALI_SDK_STS_ID,ALI_SDK_STS_SECRET,OSS_BUCKET")
  process.exit(1)
}
else {
  console.log("OSS_REGION:%s", region)
  console.log("ALI_SDK_STS_ID:%s", accessKeyId)
  console.log("ALI_SDK_STS_SECRET:%s", accessKeySecret)
  console.log("OSS_BUCKET:%s", bucket)

}

var client = new OSS({
  region,
  accessKeyId,
  accessKeySecret,
  bucket,
});

var JAZZ_STATIC_CDN = process.env["JAZZ_STATIC_CDN"];

function replaceCSS(filePath) {
  var content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/__JAZZ_STATIC_CDN__/g, JAZZ_STATIC_CDN);
  content = content.replace(/__POLKA_WEB_HOST__/g, process.env["POLKA_WEB_HOST"]);

  fs.writeFileSync(filePath, content, {encoding: "utf8"});
}

co(function* () {
    var files = fs.readdirSync(path.join(process.cwd(), "build/assets"));
    for(let i=0;i< files.length; ++i) {
      let file = files[i];
      let filePath = path.join(process.cwd(), "build/assets", file);
      // console.log(file);
      if(file.endsWith('.css') || file.endsWith('.js')) {
        replaceCSS(filePath);
      }
      let result = yield client.put(`jazz/${file}`, filePath);
      console.log(result);
    }

    process.exit(0)

}).catch(function(err) {
    console.error(err);
    process.exit(1)
})