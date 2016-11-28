'use strict';

module.exports = {
    KPI:{
		getKPIPeriod: '/kpi/getkpiperiod/{customerid}',
		setKPIPeriod: '/kpi/setkpiperiod',
		getKPIPeriodByYear: '/kpi/getKPIPeriodPoint/{customerid}/{year}',
		getDimension:'/AreaDimension/GetAreaDimensionTree',
		getTags:'/Tag/GetTagsByFilter',
        getKPIConfigured: '/KPI/chart/exist/{customerId}/{HierarchyId}',
        getKPIChart: '/KPI/chart/{customerId}/{HierarchyId}/{year}',
        getKPIChartSummary: '/KPI/GetKpiChartSummary/{customerId}/{HierarchyId}/{year}',
    getKpi:'/kpi/settings/{kpiId}/{year}',
    getCalcValue:'/kpi/calckpigradualvalue',
    IsAutoCalculable:'/kpi/IsAutoCalculable?tagId={tagId}&year={year}',
    getCalcPredicate:'/kpi/CalcKPIPredicateValue',
    createKpiReportSettings:'/kpi/CreateKpiSettings',
    updateKpiReportSettings:'/kpi/UpdateKpiSettings',
    updatePredictionSetting:'/kpi/UpdatePredictionSetting'
	}
};
