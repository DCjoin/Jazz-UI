'use strict';

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
  }]);
  next();
};

/**
 * organization end
 */
exports.register.attributes = {
  name: 'analysis'
};
