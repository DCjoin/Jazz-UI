'use strict';

var util = require('./util.js');
var APIBasePath = require('./APIBasePath.js');
var APIPath = require('../app/constants/Path.jsx');
var KPIData = require('../../mockData/KPIData.js');

var sleep = util.sleep;


exports.register = function(server, options, next) {
    server.route([{
        method: 'get',
        path: APIBasePath + APIPath.KPI.getKPIPeriod,
        handler: function(request, reply) {
            sleep(2000);
            var result = KPIData.KPIPeriodNon;
            if (request.params.customerid === '100001') {
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
        }, {
            method: 'get',
            path: APIBasePath + APIPath.KPI.getKPIPeriodByYear,
            handler: function(request, reply) {
                return reply({
                    "error": { "Code": "0", "Messages": null },
                    "Result": KPIData.currentQuotaperiod_year
                }).type("application/json");
            }
        },
        // {
        //     method: 'get',
        //     path: APIBasePath + APIPath.KPI.getKpi,
        //     handler: function(request, reply) {
        //         if(request.params.year === '2016') {
        //           reply({
        //             Result:KPIData.kpi2016,
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
                    Result: ['2013', '2015', '2017'],
                    error: { Code: "0", Messages: null }
                }).type("application/json");
            }
        }, {
            method: 'get',
            path: APIBasePath + APIPath.KPI.getKPIChart,
            handler: function(request, reply) {
                sleep(1000);
                var result = KPIData.KPIChartData;
                if (request.params.year === '2016') {}
                reply({
                    Result: result,
                    error: { Code: "0", Messages: null }
                }).type("application/json");
            }
        }, {
            method: 'get',
            path: APIBasePath + APIPath.KPI.getKPIChartSummary,
            handler: function(request, reply) {
                sleep(1000);
                var result = [{
                    PredictSum: 123456789123,
                    PredictRatio: 0.6548,

                    IndexValue: 599999,
                }, {
                    LastMonthRatio: 0.5548,

                    PredictSum: 654321,
                    PredictRatio: 0.2548,

                    IndexValue: 999999,
                    RatioValue: 0.84444,
                }];
                if (request.params.year === '2016') {}
                reply({
                    Result: result,
                    error: { Code: "0", Messages: null }
                }).type("application/json");
            }
        }, {
            method: 'get',
            path: APIBasePath + APIPath.Hierarchy.GetBuildingList,
            handler: function(request, reply) {
                sleep(1000);
                var result = [{
                        Id: 123,
                        Name: '长城脚下的公社'
                    },
                     {
                                  Id: 321,
                                  Name: '朝阳门SOHO'
                                }, {
                                  Id: 11112,
                                  Name: '丹棱SOHO'
                                }, {
                                  Id: 33333,
                                  Name: '银河SOHO'
                              },
                ];
                if (request.params.year === '2016') {}
                reply({
                    Result: result,
                    error: { Code: "0", Messages: null }
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
        //               "Result": KPIData.calcValue
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
        //               "Result": KPIData.calcValue
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
        },
        {
            method: 'get',
            path: APIBasePath + '/kpi/groupsettings/{kpiSettingsId}',
            handler: function(request, reply) {
                var result = KPIData.GroupSettings.NORMAL_QUOTA;
                if (request.params.kpiSettingsId === '2') {
                  result = KPIData.GroupSettings.NORMAL_SAVING_RATE;
                }
                return reply({
                    "error": { "Code": "0", "Messages": null },
                    "Result": result
                }).type("application/json");
            }
        },
        {
            method: 'get',
            path: APIBasePath + '/kpi/group/{customerId}/{year}',
            handler: function(request, reply) {
                return reply({
                    "error": { "Code": "0", "Messages": null },
                    "Result": [{
                        KpiId: 1,
                        IndicatorName: '用水量'
                    }]
                }).type("application/json");
            }
        },
        {
            method: 'get',
            path: APIBasePath + '/kpi/groupcontinuous/{KpiId}/{year}',
            handler: function(request, reply) {
                var result = KPIData.GroupSettings.NORMAL_QUOTA;
                if (request.params.KpiId === '2') {
                  result = KPIData.GroupSettings.NORMAL_SAVING_RATE;
                }
                return reply({
                    "error": { "Code": "0", "Messages": null },
                    "Result": result
                }).type("application/json");
            }
        },
        // {
        //     method: 'post',
        //     path: APIBasePath + '/kpi/groupsettings/create',
        //     handler: function(request, reply) {
        //         return reply({
        //             //"error": { "Code": "050001228001", "Messages": null },
        //             "error": { "Code": "0", "Messages": null },
        //             "Result": {}
        //         }).type("application/json");
        //     }
        // },
        {
            method: 'post',
            path: APIBasePath + '/kpi/groupsettings/update',
            handler: function(request, reply) {
                return reply({
                    "error": { "Code": "0", "Messages": null },
                    "Result": request.params
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
    name: 'kpi'
};
