'use strict';

var util = require('./util.js');
var APIBasePath = require('./APIBasePath.js');
var APIPath = require('../app/constants/Path.jsx');
var KPIData = require('../../mockData/KPIData.js');

var sleep = util.sleep;

var currentKPI = {

};

var currentNonKPI = {

};

var otherKPI = {

};

var currentKPIperiod = {
    Id: 123,
    Year: 2015,
    Month: 1, 
    Day: 12,
    CreateTime: '2016-11-23T02:59:53.987Z'
};

var nonKPIperiod = null;

exports.register = function(server, options, next) {
    server.route([{
        method: 'get',
        path: APIBasePath + APIPath.KPI.getKPIPeriod,
        handler: function(request, reply) {
            sleep(2000);
            var result = KPIData.KPIPeriodNon;
            if(request.params.customerid === '100001') {
                result = KPIData.KPIPeriod;
            }
            return reply({
                "error": { "Code": "0", "Messages": null },
                "Result": result
            }).type("application/json");
        }
    }]);
    server.route([{
        method: 'post',
        path: APIBasePath + APIPath.KPI.setKPIPeriod,
        handler: function(request, reply) {
            sleep(2000);
            var result = request.payload;
            result.CreateTime = '2016-11-23T02:59:53.987Z';
            result.CreateUser = '老刘';
            return reply({
                "error": { "Code": "0", "Messages": null },
                "Result": result
            }).type("application/json");
        }
    }]);
    next();
};

/**
 * organization end
 */
exports.register.attributes = {
    name: 'kpi'
};
