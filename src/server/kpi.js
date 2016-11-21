'use strict';

var util = require('./util.js');

var sleep = util.sleep;

var currentKPI = {

};

var currentNonKPI = {

};

var otherKPI = {

};

var nonKPI = null;

exports.register = function(server, options, next) {
    server.route([{
        method: 'get',
        path: '/API/kpi/KpiActuality/manage/{customerId}',
        handler: function(request, reply) {
            if(request.params.customerId === '100001') {

            }
            reply({
                "error": { "Code": "0", "Messages": null },
                "Result": nonKPI
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
