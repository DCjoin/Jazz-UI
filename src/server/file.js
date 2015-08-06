'use strict'

var util = require('./util.js');

var sleep = util.sleep;


 exports.register = function(server, options, next){

    server.route([
        {
    	    method: 'POST',
    	    path: '/webhost/API/Dashboard.svc/GetWdigetFolderTreeByCustomerId',
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
        {
          method: 'POST',
          path: '/webhost/API/Dashboard.svc/CreateWidgetOrFolder',
          handler: function (request, reply) {
            	var newUser = request.payload;

        		reply({
              GetHierarchyTreeDtosRecursiveResult:{
                Id: (newUser.ParentId+10),
                Name: newUser.Name,
                Version: 3345938,
                AssoiciatedTagCountP: null,
                Type:newUser.Type,
                SubWidgetCount :0,
                SubFolderCount :0
              },
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
     name: 'file'
 };
