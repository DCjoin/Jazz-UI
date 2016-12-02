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
var currentQuotaperiod_year = [
  '/Date(' + new Date(2016,6,1).getTime() + ')/',
  '/Date(' + new Date(2016,7,1).getTime() + ')/',
  '/Date(' + new Date(2016,8,1).getTime() + ')/',
  '/Date(' + new Date(2016,9,1).getTime() + ')/',
  '/Date(' + new Date(2016,10,1).getTime() + ')/',
  '/Date(' + new Date(2016,11,1).getTime() + ')/',
  '/Date(' + new Date(2016,12,1).getTime() + ')/',
  '/Date(' + new Date(2017,1,1).getTime() + ')/',
  '/Date(' + new Date(2017,2,1).getTime() + ')/',
  '/Date(' + new Date(2017,3,1).getTime() + ')/',
  '/Date(' + new Date(2017,4,1).getTime() + ')/',
  '/Date(' + new Date(2017,5,1).getTime() + ')/',
  ];
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

var KPIChartData =
{
  "Year": 2016,
  "IndicatorCharts": [
    {
      "IndicatorType": 1,
      "IndicatorId": 1,
      "IndicatorName": "用电量",
      "UomId": 3,
      "ActualMonthValues": [
        {
          "Month": "2016-06-27T15:15:58.969Z",
          "Value": 100
        },
        {
          "Month": "2016-07-27T15:15:58.969Z",
          "Value": 130
        },
        {
          "Month": "2016-08-27T15:15:58.969Z",
          "Value": 123
        },
        {
          "Month": "2016-09-27T15:15:58.969Z",
          "Value": 111
        },
        {
          "Month": "2016-10-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2016-11-27T15:15:58.969Z",
          "Value": 175
        },
        {
          "Month": "2016-12-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-01-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-02-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-03-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-04-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-05-27T15:15:58.969Z",
          "Value": null
        }
      ],
      "TargetMonthValues": [
        {
          "Month": "2016-06-27T15:15:58.969Z",
          "Value": 120
        },
        {
          "Month": "2016-07-27T15:15:58.969Z",
          "Value": 140
        },
        {
          "Month": "2016-08-27T15:15:58.969Z",
          "Value": 133
        },
        {
          "Month": "2016-09-27T15:15:58.969Z",
          "Value": 131
        },
        {
          "Month": "2016-10-27T15:15:58.969Z",
          "Value": 199
        },
        {
          "Month": "2016-11-27T15:15:58.969Z",
          "Value": 175
        },
        {
          "Month": "2016-12-27T15:15:58.969Z",
          "Value": 234
        },
        {
          "Month": "2017-01-27T15:15:58.969Z",
          "Value": 252
        },
        {
          "Month": "2017-02-27T15:15:58.969Z",
          "Value": 284
        },
        {
          "Month": "2017-03-27T15:15:58.969Z",
          "Value": 242
        },
        {
          "Month": "2017-04-27T15:15:58.969Z",
          "Value": 290
        },
        {
          "Month": "2017-05-27T15:15:58.969Z",
          "Value": 120
        }
      ],
      "PredictionMonthValues": [
        {
          "Month": "2016-06-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2016-07-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2016-08-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2016-09-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2016-10-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2016-11-27T15:15:58.969Z",
          "Value": 175
        },
        {
          "Month": "2016-12-27T15:15:58.969Z",
          "Value": 192
        },
        {
          "Month": "2017-01-27T15:15:58.969Z",
          "Value": 182
        },
        {
          "Month": "2017-02-27T15:15:58.969Z",
          "Value": 162
        },
        {
          "Month": "2017-03-27T15:15:58.969Z",
          "Value": 199
        },
        {
          "Month": "2017-04-27T15:15:58.969Z",
          "Value": 200
        },
        {
          "Month": "2017-05-27T15:15:58.969Z",
          "Value": 210
        }
      ]
    },
    {
      "IndicatorType": 2,
      "IndicatorId": 2,
      "IndicatorName": "用水量",
      "UomId": 4,
      "ActualMonthValues": [
        {
          "Month": "2016-06-27T15:15:58.969Z",
          "Value": 100
        },
        {
          "Month": "2016-07-27T15:15:58.969Z",
          "Value": 130
        },
        {
          "Month": "2016-08-27T15:15:58.969Z",
          "Value": 123
        },
        {
          "Month": "2016-09-27T15:15:58.969Z",
          "Value": 111
        },
        {
          "Month": "2016-10-27T15:15:58.969Z",
          "Value": 123
        },
        {
          "Month": "2016-11-27T15:15:58.969Z",
          "Value": 175
        },
        {
          "Month": "2016-12-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-01-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-02-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-03-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-04-27T15:15:58.969Z",
          "Value": null
        },
        {
          "Month": "2017-05-27T15:15:58.969Z",
          "Value": null
        }
      ]
    }
  ]
}

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
        path: APIBasePath + APIPath.KPI.getKPIPeriodByYear,
        handler: function(request, reply) {
            return reply({
                "error": { "Code": "0", "Messages": null },
                "Result": currentQuotaperiod_year
            }).type("application/json");
        }
    },
    // {
    //     method: 'get',
    //     path: APIBasePath + APIPath.KPI.getKpi,
    //     handler: function(request, reply) {
    //         if(request.params.year === '2016') {
    //           reply({
    //             Result:kpi2016,
    //             error: {Code: "0", Messages: null}
    //            }).type("application/json");
    //         }
    //         else {
    //           reply({
    //               "error": { "Code": "0", "Messages": null },
    //               "Result": ''
    //           }).type("application/json");
    //         }
    //     }
    // },
    {
        method: 'get',
        path: APIBasePath + APIPath.KPI.getKPIConfigured,
        handler: function(request, reply) {
          sleep(1000);
            reply({
              Result:['2013', '2015', '2017'],
              error: {Code: "0", Messages: null}
             }).type("application/json");
        }
    },
    {
        method: 'get',
        path: APIBasePath + APIPath.KPI.getKPIChart,
        handler: function(request, reply) {
          sleep(1000);
            var result = KPIChartData;
            if(request.params.year === '2016') {
            }
            reply({
              Result:result,
              error: {Code: "0", Messages: null}
             }).type("application/json");
        }
    },
    {
        method: 'get',
        path: APIBasePath + APIPath.KPI.getKPIChartSummary,
        handler: function(request, reply) {
          sleep(1000);
            var result = [{
                PredictSum: 123456789123,
                PredictRatio: 0.6548,

                IndexValue: 599999,
              },{
                LastMonthRatio: 0.5548,

                PredictSum: 654321,
                PredictRatio: 0.2548,

                IndexValue: 999999,
                RatioValue: 0.84444,
              }];
            if(request.params.year === '2016') {
            }
            reply({
              Result: result,
              error: {Code: "0", Messages: null}
             }).type("application/json");
        }
    },
    {
        method: 'get',
        path: APIBasePath + APIPath.Hierarchy.GetBuildingList,
        handler: function(request, reply) {
          sleep(1000);
            var result = [{
              Id: 123,
              Name: '长城脚下的公社'
            }/*, {
              Id: 321,
              Name: '朝阳门SOHO'
            }, {
              Id: 11112,
              Name: '丹棱SOHO'
            }, {
              Id: 33333,
              Name: '银河SOHO'
          },*/];
            if(request.params.year === '2016') {
            }
            reply({
              Result: result,
              error: {Code: "0", Messages: null}
             }).type("application/json");
        }
    },
    //for test
    // {
    //     method: 'post',
    //     path: APIBasePath + APIPath.KPI.getCalcValue,
    //     handler: function(request, reply) {
    //
    //           return reply({
    //               "error": { "Code": "0", "Messages": null },
    //               "Result": calcValue
    //           }).type("application/json");
    //         }
    //     },
        // {
        //     method: 'post',
        //     path: APIBasePath + APIPath.KPI.getCalcPredicate,
        //     handler: function(request, reply) {
        //
        //           return reply({
        //               "error": { "Code": "0", "Messages": null },
        //               "Result": calcValue
        //           }).type("application/json");
        //         }
        //     },
    {
            method: 'get',
            path: APIBasePath + APIPath.KPI.IsAutoCalculable,
            handler: function(request, reply) {
                  return reply({
                      "error": { "Code": "0", "Messages": null },
                      "Result": false
                  }).type("application/json");
                }
        },
        // {
        //         method: 'post',
        //         path: APIBasePath + APIPath.KPI.createKpiReportSettings,
        //         handler: function(request, reply) {
        //               return reply({
        //                   "error": { "Code": "050001228001", "Messages": null },
        //                   "Result": null
        //               }).type("application/json");
        //             }
        //     },
            {
                    method: 'post',
                    path: APIBasePath + APIPath.KPI.updateKpiReportSettings,
                    handler: function(request, reply) {
                          return reply({
                              "error": { "Code": "0", "Messages": null },
                              "Result": request.params
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