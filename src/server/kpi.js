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
var kpi2016={
  "Id": 1,
  "CustomerId": 100001,
  "HierarchyId": 100016,
  "HierarchyName": "楼宇BADGOOD",
  "AreaDimensionId": 1,
  "IndicatorName": "sample string 4",
  "ActualTagId": 102966,
  "ActualTagName": "V11_BuildingBC",
  "UomId": 1,
  "CommodityId": 1,
  "AdvanceSettings": {
    "Year": 1,
    "IndicatorType": 2,
    "AnnualQuota": 1.1,
    "AnnualSavingRate": 1.1,
    "TargetTagId": 1,
    "TargetMonthValues": [
      {
        "Month": "2016-11-22T05:52:43.198Z",
        "Value": 1.1
      },
      {
        "Month": "2016-11-22T05:52:43.198Z",
        "Value": 1.1
      }
    ],
    "PredictionSetting": {
      "PredictionTagId": 1,
      "TagSavingRates": [
        {
          "TagId": 1,
          "TagName": "sample string 2",
          "SavingRate": 3.1
        },
        {
          "TagId": 1,
          "TagName": "sample string 2",
          "SavingRate": 3.1
        }
      ],
      "MonthPredictionValues": [
        {
          "Month": "2016-11-22T05:52:43.198Z",
          "Value": 1.1
        },
        {
          "Month": "2016-11-22T05:52:43.198Z",
          "Value": 1.1
        }
      ]
    }
  }
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
    },
    {
        method: 'get',
        path: '/API/Kpi/settings/{kpiId}/{year}',
        handler: function(request, reply) {
            if(request.params.year === 2016) {
              reply({
                Result:kpi2016,
                error: {Code: "0", Messages: null}
               }).type("application/json");
            }
            else {
              reply({
                  "error": { "Code": "0", "Messages": null },
                  "Result": nonQuotaperiod
              }).type("application/json");
            }
        }
    }
  ]);
    next();
};

/**
 * organization end
 */
exports.register.attributes = {
    name: 'kpi'
};
