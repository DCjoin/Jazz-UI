'use strict';

var util = require('./util.js');

var sleep = util.sleep;

var allRole = [{
"PrivilegeCodes": ["1205", "1206", "2100", "2101", "2102", "2106", "2108", "2109", "2112", "2114", "2118", "2120", "2128", "2129", "2131", "2133", "2137", "2138"],
"SpId": 1,
"Id": 301635,
"Name": "0000Ally",
"Version": 8413078
}, {
"PrivilegeCodes": [],
"SpId": 1,
"Id": 300857,
"Name": "132532523523",
"Version": 8365215
}, {
"PrivilegeCodes": ["1205", "1206", "1207", "1208", "1217", "1218", "1221", "1223", "2100", "2101", "2102", "2103", "2105", "2107", "2110", "2112", "2114", "2117", "2119", "2128", "2129", "2131", "2133", "2135", "2136", "2137", "2138"],
"SpId": 1,
"Id": 301841,
"Name": "1wendy",
"Version": 8653211
}, {
"PrivilegeCodes": ["1205", "1206", "1207", "1208", "1210", "1217", "1218", "1219", "1221", "1223", "2100", "2101", "2102", "2103", "2106", "2108", "2109", "2114", "2130", "2132", "2134", "2137"],
"SpId": 1,
"Id": 300100,
"Name": "1Wendy报警-资产-工单都仅查看",
"Version": 7970988
}];

var myRole = [{
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
}];

exports.register = function(server, options, next) {
    server.route([{
        method: 'POST',
        path: '/API/AccessControl/GetRolesByFilter',
        handler: function(request, reply) {
            var result = allRole;
            if( request.payload.filter.UserIds ) {
                result = myRole;
            }
            reply({
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
    name: 'user'
};
