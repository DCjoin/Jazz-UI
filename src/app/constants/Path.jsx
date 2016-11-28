'use strict';

module.exports = {
    Hierarchy: {
        GetBuildingList: '/Hierarchy/GetBuildingList/{customerId}'
    },
    KPI:{
		getKPIPeriod: '/kpi/getkpiperiod/{customerid}',
		setKPIPeriod: '/kpi/setkpiperiod',
		getKPIPeriodByYear: '/kpi/getkpiperiodpoint/{customerid}/{year}',
		getDimension:'/AreaDimension/GetAreaDimensionTree',
		getTags:'/Tag/GetTagsByFilter',
        getKPIConfigured: '/KPI/chart/exist/{customerId}/{HierarchyId}',
        getKPIChart: '/KPI/chart/{customerId}/{year}/{HierarchyId}',
        getKPIChartSummary: '/KPI/calcpredictsum/{customerId}/{year}/{HierarchyId}',
    getKpi:'/kpi/settings/{kpiId}/{year}',
    getCalcValue:'/kpi/calckpigradualvalue',
    IsAutoCalculable:'/kpi/isautocalculable/{customerId}/{tagId}/{year}',
    getCalcPredicate:'/kpi/CalcKPIPredicateValue',
    createKpiReportSettings:'/kpi/settings/create',
    updateKpiReportSettings:'/kpi/PredictionSetting/update',
    updatePredictionSetting:'kpi/PredictionSetting/update'
	}
};
