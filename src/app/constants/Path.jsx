'use strict';

module.exports = {

	APISubPaths: {
    KPI:{
    	getQuotaperiod: '/kpi/getquotaperiod/{customerid}',
			getQuotaperiodByYear: '/kpi/getkpiperiodpoint/{customerid}/{year}',
			getDimension:'/AreaDimension/GetAreaDimensionTree',
			getTags:'/Tag/GetTagsByFilter',
			getKpi:'/kpi/settings/{kpiId}/{year}',
			getCalcValue:'/kpi/calckpigradualvalue'
		}
  }
};
