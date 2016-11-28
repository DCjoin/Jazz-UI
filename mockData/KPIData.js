module.exports = {
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
	}
};
