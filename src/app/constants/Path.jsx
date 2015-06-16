'use strict';

let basePath;
if ("production" !== process.env.NODE_ENV) {
	basePath = "/web/API";
	console.log(process.env.NODE_ENV+'---------------------------');
}else{
	console.log(process.env.NODE_ENV+'+++++++++++++++++++++++');
	basePath = "/webhost/API";
}

 let pathConfig = {

	 //APIBasePath: "/WebHost/API",
	 APIBasePath: basePath,


	APISubPaths: {

  }

};

module.exports = pathConfig;
