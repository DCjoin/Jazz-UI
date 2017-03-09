'use strict';

var util = require('./util.js');

var sleep = util.sleep;


exports.register = function(server, options, next) {
    server.route([{
        method: 'post',
        path: '/TagImportExcel.aspx',
        handler: function(request, reply) {
            reply({
                "SheetList": null,
                "TemplateId": 0,
                "UploadResponse": { "ErrorCode": -1, "ErrorDetail": null },
                "success": false
            }).type("text/html");
        }
    }]);
    next();
};

/**
 * organization end
 */
exports.register.attributes = {
    name: 'template'
};
