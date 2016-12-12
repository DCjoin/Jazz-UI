const currentQuotaperiod_year = [
    '/Date(' + new Date(2016, 6, 1).getTime() + ')/',
    '/Date(' + new Date(2016, 7, 1).getTime() + ')/',
    '/Date(' + new Date(2016, 8, 1).getTime() + ')/',
    '/Date(' + new Date(2016, 9, 1).getTime() + ')/',
    '/Date(' + new Date(2016, 10, 1).getTime() + ')/',
    '/Date(' + new Date(2016, 11, 1).getTime() + ')/',
    '/Date(' + new Date(2016, 12, 1).getTime() + ')/',
    '/Date(' + new Date(2017, 1, 1).getTime() + ')/',
    '/Date(' + new Date(2017, 2, 1).getTime() + ')/',
    '/Date(' + new Date(2017, 3, 1).getTime() + ')/',
    '/Date(' + new Date(2017, 4, 1).getTime() + ')/',
    '/Date(' + new Date(2017, 5, 1).getTime() + ')/',
];
module.exports = {
	currentQuotaperiod_year,
	KPIPeriod: {
	    Id: 123,
	    Year: 2015,
	    Month: 1,
	    Day: 12,
	    CreateTime: '2016-11-23T02:59:53.987Z'
	},
	KPIPeriodNon: null,
	KPINoAdvanceSettings:{},
	KPIHasAdvanceSettings:{
		AdvanceSettings:{
			Year:2016,
			IndicatorType:1,
			AnnualQuota:1
		}
	},
	KPIValidateData:{
		Empty:{},
		TestBasic1 :{
			IndicatorName:'',
			ActualTagName:''
		},
		TestBasic2 :{
			IndicatorName:'xx',
			ActualTagName:''
		},
		TestBasic3 :{
			IndicatorName:'',
			ActualTagName:'xx'
		},
		TestBasic4 :{
			IndicatorName:'xx',
			ActualTagName:'xx'
		},
		TestAnnualQuota1 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:''
			}

		},
		TestAnnualQuota2 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:0
			}
		},
		TestAnnualQuota3 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:'-1'
			}
		},
		TestAnnualSavingRate1 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:'',
				AnnualSavingRate:''
			}

		},
		TestAnnualSavingRate2 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:0,
				AnnualSavingRate:0
			}
		},
		TestAnnualSavingRate3 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:0,
				AnnualSavingRate:'-100.1'
			}
		},
		TestTargetMonthValues1 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:0,
				AnnualSavingRate:'-100.1',
				TargetMonthValues:[]
			}
		},
		TestTargetMonthValues2 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:0,
				AnnualSavingRate:'-100.1',
				TargetMonthValues:[
					{
						Value:0
					}
				]
			}
		},
		TestTargetMonthValues3 :{
			IndicatorName:'xx',
			ActualTagName:'xx',
			AdvanceSettings:{
				AnnualQuota:0,
				AnnualSavingRate:'-100.1',
				TargetMonthValues:[
					{
						Value:0
					},
					{
						Value:-1
					}
				]
			}
		},
	},

	kpi2016: {
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
	        "TargetMonthValues": [{
	            "Month": "2016-11-22T05:52:43.198Z",
	            "Value": 1.1
	        }, {
	            "Month": "2016-11-22T05:52:43.198Z",
	            "Value": 1.1
	        }],
	        "PredictionSetting": {
	            "PredictionTagId": 1,
	            "TagSavingRates": [{
	                "TagId": 1,
	                "TagName": "sample string 2",
	                "SavingRate": 3.1
	            }, {
	                "TagId": 1,
	                "TagName": "sample string 2",
	                "SavingRate": 3.1
	            }],
	            "MonthPredictionValues": [{
	                "Month": "2016-11-22T05:52:43.198Z",
	                "Value": 1.1
	            }, {
	                "Month": "2016-11-22T05:52:43.198Z",
	                "Value": 1.1
	            }]
	        }
	    }
	},

	KPIChartData: {
	    "Year": 2016,
	    "IndicatorCharts": [{
	        "IndicatorType": 1,
	        "IndicatorId": 1,
	        "IndicatorName": "用电量",
	        "UomId": 3,
	        "ActualMonthValues": [{
	            "Month": "2016-06-27T15:15:58.969Z",
	            "Value": 100
	        }, {
	            "Month": "2016-07-27T15:15:58.969Z",
	            "Value": 130
	        }, {
	            "Month": "2016-08-27T15:15:58.969Z",
	            "Value": 123
	        }, {
	            "Month": "2016-09-27T15:15:58.969Z",
	            "Value": 111
	        }, {
	            "Month": "2016-10-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2016-11-27T15:15:58.969Z",
	            "Value": 175
	        }, {
	            "Month": "2016-12-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-01-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-02-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-03-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-04-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-05-27T15:15:58.969Z",
	            "Value": null
	        }],
	        "TargetMonthValues": [{
	            "Month": "2016-06-27T15:15:58.969Z",
	            "Value": 120
	        }, {
	            "Month": "2016-07-27T15:15:58.969Z",
	            "Value": 140
	        }, {
	            "Month": "2016-08-27T15:15:58.969Z",
	            "Value": 133
	        }, {
	            "Month": "2016-09-27T15:15:58.969Z",
	            "Value": 131
	        }, {
	            "Month": "2016-10-27T15:15:58.969Z",
	            "Value": 199
	        }, {
	            "Month": "2016-11-27T15:15:58.969Z",
	            "Value": 175
	        }, {
	            "Month": "2016-12-27T15:15:58.969Z",
	            "Value": 234
	        }, {
	            "Month": "2017-01-27T15:15:58.969Z",
	            "Value": 252
	        }, {
	            "Month": "2017-02-27T15:15:58.969Z",
	            "Value": 284
	        }, {
	            "Month": "2017-03-27T15:15:58.969Z",
	            "Value": 242
	        }, {
	            "Month": "2017-04-27T15:15:58.969Z",
	            "Value": 290
	        }, {
	            "Month": "2017-05-27T15:15:58.969Z",
	            "Value": 120
	        }],
	        "PredictionMonthValues": [{
	            "Month": "2016-06-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2016-07-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2016-08-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2016-09-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2016-10-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2016-11-27T15:15:58.969Z",
	            "Value": 175
	        }, {
	            "Month": "2016-12-27T15:15:58.969Z",
	            "Value": 192
	        }, {
	            "Month": "2017-01-27T15:15:58.969Z",
	            "Value": 182
	        }, {
	            "Month": "2017-02-27T15:15:58.969Z",
	            "Value": 162
	        }, {
	            "Month": "2017-03-27T15:15:58.969Z",
	            "Value": 199
	        }, {
	            "Month": "2017-04-27T15:15:58.969Z",
	            "Value": 200
	        }, {
	            "Month": "2017-05-27T15:15:58.969Z",
	            "Value": 210
	        }]
	    }, {
	        "IndicatorType": 2,
	        "IndicatorId": 2,
	        "IndicatorName": "用水量",
	        "UomId": 4,
	        "ActualMonthValues": [{
	            "Month": "2016-06-27T15:15:58.969Z",
	            "Value": 100
	        }, {
	            "Month": "2016-07-27T15:15:58.969Z",
	            "Value": 130
	        }, {
	            "Month": "2016-08-27T15:15:58.969Z",
	            "Value": 123
	        }, {
	            "Month": "2016-09-27T15:15:58.969Z",
	            "Value": 111
	        }, {
	            "Month": "2016-10-27T15:15:58.969Z",
	            "Value": 123
	        }, {
	            "Month": "2016-11-27T15:15:58.969Z",
	            "Value": 175
	        }, {
	            "Month": "2016-12-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-01-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-02-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-03-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-04-27T15:15:58.969Z",
	            "Value": null
	        }, {
	            "Month": "2017-05-27T15:15:58.969Z",
	            "Value": null
	        }],
	        "RatioMonthValues": [{
	            "Month": "2016-06-27T15:15:58.969Z",
	            "Value": 4
	        }, {
	            "Month": "2016-07-27T15:15:58.969Z",
	            "Value": 5
	        }, {
	            "Month": "2016-08-27T15:15:58.969Z",
	            "Value": 6
	        }, {
	            "Month": "2016-09-27T15:15:58.969Z",
	            "Value": 7
	        }, {
	            "Month": "2016-10-27T15:15:58.969Z",
	            "Value": 8
	        }, {
	            "Month": "2016-11-27T15:15:58.969Z",
	            "Value": 9
	        }, {
	            "Month": "2016-12-27T15:15:58.969Z",
	            "Value": 10
	        }, {
	            "Month": "2017-01-27T15:15:58.969Z",
	            "Value": 11
	        }, {
	            "Month": "2017-02-27T15:15:58.969Z",
	            "Value": 12
	        }, {
	            "Month": "2017-03-27T15:15:58.969Z",
	            "Value": 13
	        }, {
	            "Month": "2017-04-27T15:15:58.969Z",
	            "Value": 14
	        }, {
	            "Month": "2017-05-27T15:15:58.969Z",
	            "Value": 15
	        }]
	    }]
	},

	calcValue: [{
	    "Month": "2016-06-01",
	    "Value": 10000.2
	}, {
	    "Month": "2016-07-01",
	    "Value": 10000.2
	}, {
	    "Month": "2016-08-01",
	    "Value": 10000.2
	}, {
	    "Month": "2016-09-01",
	    "Value": 10000.2
	}, {
	    "Month": "2016-10-01",
	    "Value": 10000.2
	}, {
	    "Month": "2016-11-01",
	    "Value": 10000.2
	}, {
	    "Month": "2016-12-01",
	    "Value": 10000.2
	}, {
	    "Month": "2017-01-01",
	    "Value": 10000.2
	}, {
	    "Month": "2017-02-01",
	    "Value": 10000.2
	}, {
	    "Month": "2017-03-01",
	    "Value": 10000.2
	}, {
	    "Month": "2017-04-01",
	    "Value": 10000.2
	}, {
	    "Month": "2017-05-01",
	    "Value": 10000.2
	}],

	GroupSettings: {
		NORMAL_QUOTA: {
			GroupKpiSetting: {
			    Id: 1,
			    KpiType: 2,
			    CustomerId: 100001,
			    HierarchyId: 100001,
			    HierarchyName: "客户一",
			    IndicatorName: "天然气用量",
			    UomId: 1,
			    CommodityId: 1,
			    AdvanceSettings: {
					Year: 2016,
					IndicatorType: 1,
					AnnualQuota: 1236547891111,
					AnnualSavingRate: 0
			    }

			},
			BuildingKpiSettingsList: [{
				Id: 11,
				KpiType: 1,
				CustomerId: 100001,
				HierarchyId: 100011,
				HierarchyName: '建筑一',
				ActualTagId: 1,
				ActualTagName: '数据点一',
				UomId: 2,
				AdvanceSettings: {
					Year: 2016,
					IndicatorType: 1,
					AnnualQuota: 123123,
					AnnualSavingRate: 0,
					TargetTagId: 1,
					TargetMonthValues: currentQuotaperiod_year.map( Month => {return {
						Month,
						Value: parseInt(Math.random()*100)
					}} ),
					PredictionSetting: [{
						PredictionTagId: 1,
						KpiSettingsId: 1,
						TagSavingRates: [{
							TagId: 1,
							TagName: '数据点一',
							SavingRate: parseInt(Math.random()*100)
						}, {
							TagId: 2,
							TagName: '数据点二',
							SavingRate: parseInt(Math.random()*100)
						}],
						MonthPredictionValues: currentQuotaperiod_year.map( Month => {return Month > '/Date(' + new Date(2016, 12, 1).getTime() + ')/' ? {
							Month,
							Value: parseInt(Math.random()*100)
						} : null } ),
					}],			
				}
			}]
		},
		NORMAL_SAVING_RATE: {
			GroupKpiSetting: {
			    Id: 1,
			    KpiType: 2,
			    CustomerId: 100001,
			    HierarchyId: 100001,
			    HierarchyName: "客户一",
			    IndicatorName: "用水量",
			    ActualTagId: 6,
			    ActualTagName: "实际数据点2",
			    UomId: 3,
			    CommodityId: 2,
			    AdvanceSettings: {
					Year: 2016,
					IndicatorType: 2,
					AnnualQuota: 0,
					AnnualSavingRate: 42.2
			    }
			},
			BuildingKpiSettingsList: [{
				Id: 11,
				KpiType: 1,
				CustomerId: 100001,
				HierarchyId: 100011,
				HierarchyName: '建筑一',
				ActualTagId: 1,
				ActualTagName: '数据点一',
				UomId: 3,
				AdvanceSettings: {
					Year: 2016,
					IndicatorType: 2,
					AnnualQuota: 123123,
					AnnualSavingRate: 30,
					TargetTagId: 1,
					TargetMonthValues: currentQuotaperiod_year.map( Month => {return {
						Month,
						Value: parseInt(Math.random()*100)
					}} ),
					PredictionSetting: [{
						PredictionTagId: 1,
						KpiSettingsId: 1,
						TagSavingRates: [{
							TagId: 1,
							TagName: '数据点一',
							SavingRate: parseInt(Math.random()*100)
						}, {
							TagId: 2,
							TagName: '数据点二',
							SavingRate: parseInt(Math.random()*100)
						}],
						MonthPredictionValues: currentQuotaperiod_year.map( Month => {return Month > '/Date(' + new Date(2016, 12, 1).getTime() + ')/' ? {
							Month,
							Value: parseInt(Math.random()*100)
						} : null } ),
					}],			
				}
			}]
		},
	}
};
