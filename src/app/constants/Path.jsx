'use strict';

module.exports = {

    KPI:{
		getKPIPeriod: '/kpi/getkpiperiod/{customerid}',
		setKPIPeriod: '/kpi/setkpiperiod',
		getKPIPeriodByYear: '/kpi/getkpiperiod/{customerid}/{year}',
		getDimension:'/AreaDimension/GetAreaDimensionTree',
		getTags:'/Tag/GetTagsByFilter',
    getKpi:'/kpi/settings/{kpiId}/{year}',
    getCalcValue:'/kpi/calckpigradualvalue'
	}
};
