'use strict';
var fs = require('fs');

var util = require('./util.js');
var analysisData = require('../../mockData/DataAnalysis.js');

var sleep = util.sleep;


exports.register = function(server, options, next){
  server.route([{
    method: 'get',
    path: '/API/energy/gettagsdatabyid/{widgetId}',
    handler: function (request, reply){
  		reply(analysisData.getChartDataById).type("application/json");
    }
  }, {
    method: 'post',
    path: '/API/Dashboard/GetWdigetFolderTreeByHierarchyId',
    handler: function (request, reply){
    	if( request.payload.hierarchyId !== 100002 ) {
    		// sleep(10000);
    	// 	// setTimeout(function() {
    	// 		fs.readFile('C:\\Install\\eclipse.7z', (err, data) => {
  			// data += data;
  			// reply(data).type("text/plain");

    	// 		})
    		// }, 60000);
    		reply(analysisData.GetWdigetFolderTreeByHierarchyId1).type("text/plain");
    	} else {
    		reply(analysisData.GetWdigetFolderTreeByHierarchyId2).type("application/json");
    	}
    }
  }, ]);
  next();
};

/**
 * organization end
 */
exports.register.attributes = {
  name: 'analysis'
};
