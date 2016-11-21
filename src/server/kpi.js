'use strict';

var util = require('./util.js');

var sleep = util.sleep;

var currentKPI = {

};

var currentNonKPI = {

};

var otherKPI = {

};

var currentQuotaperiod = {
    Id: 123,
    Year: 2015,
    Month: 1, 
    Day: 12,
};

var nonQuotaperiod = null;

exports.register = function(server, options, next) {
    server.route([{
        method: 'get',
        path: '/API/quota/getquotaperiod/{customerid}',
        handler: function(request, reply) {
            if(request.params.customerid === '100001') {
                return reply({
                    "error": { "Code": "0", "Messages": null },
                    "Result": currentQuotaperiod
                }).type("application/json");
            }
            return reply({
                "error": { "Code": "0", "Messages": null },
                "Result": nonQuotaperiod
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
