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
var currentQuotaperiod_year = ["2016-06-01","2016-07-01","2016-08-01","2016-09-01","2016-10-01","2016-11-01","2016-12-01","2017-01-01","2017-02-01","2017-03-01","2017-04-01","2017-05-01"];
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
    "Year": 2015,
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
var calcValue=[
  {
      "Month": "2016-06-01",
      "Value": 10000.2
    },
  {
      "Month": "2016-07-01",
      "Value": 10000.2
      },
  {
      "Month": "2016-08-01",
      "Value": 10000.2
  },
  {
      "Month": "2016-09-01",
      "Value": 10000.2
    },
  {
      "Month": "2016-10-01",
      "Value": 10000.2
    },
  {
      "Month": "2016-11-01",
      "Value": 10000.2
  },
 {
      "Month": "2016-12-01",
      "Value": 10000.2
  },
  {
      "Month": "2017-01-01",
      "Value": 10000.2
    },
  {
     "Month": "2017-02-01",
     "Value": 10000.2
    },
    {
     "Month": "2017-03-01",
      "Value": 10000.2
    },
  {
    "Month": "2017-04-01",
    "Value": 10000.2
    },
  {
    "Month": "2017-05-01",
  "Value": 10000.2
}];

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
    },
    {
        method: 'get',
        path: '/API/kpi/getkpiperiodpoint/{customerid}/{year}',
        handler: function(request, reply) {
            return reply({
                "error": { "Code": "0", "Messages": null },
                "Result": currentQuotaperiod_year
            }).type("application/json");
        }
    },
    {
        method: 'get',
        path: '/API/kpi/settings/{kpiId}/{year}',
        handler: function(request, reply) {
            if(request.params.year === '2016') {
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
    },
    {
        method: 'post',
        path: '/API/kpi/calckpigradualvalue',
        handler: function(request, reply) {

              return reply({
                  "error": { "Code": "0", "Messages": null },
                  "Result": calcValue
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
    name: 'kpi'
};
