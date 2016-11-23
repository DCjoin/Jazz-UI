'use strict';

module.exports = {

	APISubPaths: {
    KPI:{
    	getQuotaperiod: '/quota/getquotaperiod/{customerid}',
			getDimension:'/AreaDimension/GetAreaDimensionTree',
			getTags:'/Tag/GetTagsByFilter',
			getKpi:'/Kpi/settings/{kpiId}/{year}'
		}
  }
};
