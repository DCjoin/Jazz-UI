'use strict';

var util = require('./util.js');

var sleep = util.sleep;


exports.register = function(server, options, next) {
    server.route([{
        method: 'POST',
        path: '/API/AccessControl/GetRolesByFilter',
        handler: function(request, reply) {
            reply({
                "error": { "Code": "0", "Messages": null },
                "Result": [{
                    "PrivilegeCodes": [
                        "1205",
                        "1206", 
                        "1207", 
                        "1208", 
                        "1210", 
                        "1217", 
                        "1218", 
                        "1219", 
                        "1221", 
                        "1222", 
                        "1223", 
                        "2100", 
                        "2101", 
                        "2102", 
                        "2103", 
                        "2105", 
                        "2107", 
                        "2110", 
                        "2112", 
                        "2114", 
                        "2117", 
                        "2119", 
                        "2127", 
                        "2129", 
                        "2131", 
                        "2133", 
                        "2134", 
                        "2135", 
                        "2136", 
                        "2137", 
                        "2138",
                        "1300"
                    ],
                    "SpId": 1,
                    "Id": 100001,
                    "Name": "服务商管理员",
                    "Version": 8711833
                }]
            }).type("application/json");
        }
    }]);
    next();
};

/**
 * organization end
 */
exports.register.attributes = {
    name: 'user'
};
