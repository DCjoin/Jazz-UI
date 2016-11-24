'use strict';

module.exports = {
    KPI:{
		getKPIPeriod: '/kpi/getkpiperiod/{customerid}',
		setKPIPeriod: '/kpi/setkpiperiod',
		getKPIPeriodByYear: '/kpi/getKPIPeriodPoint/{customerid}/{year}',
		getDimension:'/AreaDimension/GetAreaDimensionTree',
		getTags:'/Tag/GetTagsByFilter',
    getKpi:'/kpi/settings/{kpiId}/{year}',
    getCalcValue:'/kpi/calckpigradualvalue',
    IsAutoCalculable:'/kpi/IsAutoCalculable?tagId={tagId}&year={year}',
    getCalcPredicate:'/kpi/CalcKPIPredicateValue',
    createKpiReportSettings:'/kpi/CreateKpiSettings',
    updateKpiReportSettings:'/kpi/UpdateKpiSettings'
	}
};
