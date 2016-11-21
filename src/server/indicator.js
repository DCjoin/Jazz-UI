'use strict'

var util = require('./util.js');

var sleep = util.sleep;


 exports.register = function(server, options, next){

    server.route([
        {
    	    method: 'POST',
    	    path: '/webhost/API/Dashboard/GetWdigetFolderTreeByCustomerIdxx',
    	    handler: function (request, reply) {
    			reply({
            GetHierarchyTreeDtosRecursiveResult:
            {Id: -1, Name: "NancyCostCustomer2", Version: 3345938, AssoiciatedTagCountP: null,Type:6,
                    SubWidgetCount :0,
                    SubFolderCount :0},
            error: {Code: "0", Messages: null}
           }).type("application/json");
            }
        },
    ]);
    next();
};

/**
 * organization end
 */
 exports.register.attributes = {
     name: 'indicator'
 };
