'use strict';
var fs = require('fs');

var util = require('./util.js');
var analysisData = require('../../mockData/DataAnalysis.js');
var diagnose = require('../../mockData/diagnose.js');
var Path = require('../../src/app/constants/Path.jsx');

var sleep = util.sleep;


exports.register = function(server, options, next){
  server.route([{
    method: 'post',
    path: '/API/diagnose/chart/data',
    handler: function (request, reply){
      setTimeout(function() {
        analysisData.getChartDataById.Result.DiagnoseEnergyViewData = analysisData.getChartDataById.Result.EnergyViewData;
        analysisData.getChartDataById.Result.TriggerValue = 180;
        reply(analysisData.getChartDataById).type("application/json");
      }, 1000);
    }
  }, {
    method: 'post',
    path: Path.Diagnose.getDiagnoseTag,
    handler: function (request, reply){
      setTimeout(function() {
        reply({"error": { "Code": "0", "Messages": null },Result: diagnose.tagList}).type("application/json");
      }, 1000);
    }
  }
  ]);
  next();
};

/**
 * organization end
 */
exports.register.attributes = {
  name: 'diagnose'
};
