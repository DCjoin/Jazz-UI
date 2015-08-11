'use strict'

var util = require('./util.js');

var sleep = util.sleep;


 exports.register = function(server, options, next){

    server.route([
        {
    	    method: 'POST',
    	    path: '/webhost/API//Energy.svc/RankingEnergyUsageData',
    	    handler: function (request, reply) {
    			reply({
            RankingEnergyUsageDataResult:{
              CacheStatus:0,
              Calendars:null,
              Errors:null,
              ExportedFileName:null,
              LabelingLevels:null,
              NavigatorData:null,
              TargetEnergyData:[{
                EnergyAssociatedData:null,
                EnergyData:[{
                  DataQuality:0,
                  DataValue:71949.9,
                  LocalTime:"\/Date(1439276352394)\/"
                }],
                Target:{
                  Association:null,
                  Code:null,
                  CommodityId:1,
                  Name:"CN0103",
                  Step:null,
                  TargetId:null,
                  TimeSpan:null,
                  Type:5,
                  Uom:"KWH",
                  UomId:1
                }
              },
              {
                EnergyAssociatedData:null,
                EnergyData:[{
                  DataQuality:0,
                  DataValue:51840,
                  LocalTime:"\/Date(1439276352760)\/"
                }],
                Target:{
                  Association:null,
                  Code:null,
                  CommodityId:1,
                  Name:"组织B",
                  Step:null,
                  TargetId:null,
                  TimeSpan:null,
                  Type:5,
                  Uom:"KWH",
                  UomId:1
                }
              },
              {
                EnergyAssociatedData:null,
                EnergyData:[{
                  DataQuality:0,
                  DataValue:42579.5,
                  LocalTime:"\/Date(1439276377644)\/"}],
                  Target:{
                    Association:null,
                    Code:null,
                    CommodityId:1,
                    Name:"CN0116",
                    Step:null,
                    TargetId:null,
                    TimeSpan:null,
                    Type:5,
                    Uom:"KWH",
                    UomId:1
                  }
                },
                {
                  EnergyAssociatedData:null,
                  EnergyData:[{
                    DataQuality:0,
                    DataValue:41880,
                    LocalTime:"\/Date(1439276354341)\/"}],
                    Target:{
                      Association:null,
                      Code:null,
                      CommodityId:1,
                      Name:"园区B",
                      Step:null,
                      TargetId:null,
                      TimeSpan:null,
                      Type:5,
                      Uom:"KWH",
                      UomId:1
                    }
                  }],
                  TotalCount:4
                },
                error:{Code:"0",Messages:null}}).type("application/json");
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
        }
    ]);
    next();
};

/**
 * organization end
 */
 exports.register.attributes = {
     name: 'rank'
 };
