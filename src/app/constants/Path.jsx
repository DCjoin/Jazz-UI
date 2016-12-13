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
    getKPIConfigured: '/kpi/{HierarchyId}/years',
    getKPIChart: '/KPI/chart/{customerId}/{year}/{HierarchyId}',
    getKPIChartSummary: '/KPI/calcpredictsum/{customerId}/{year}/{HierarchyId}',
    getKpi:'/kpi/settings/{kpiId}/{year}',
    getCalcValue:'/kpi/calckpigradualvalue',
    IsAutoCalculable:'/kpi/isautocalculable/{customerId}/{tagId}/{year}',
    getCalcPredicate:'/kpi/CalcKPIPredicateValue',
    createKpiReportSettings:'/kpi/settings/create',
    updateKpiReportSettings:'/kpi/settings/update',
    updatePredictionSetting:'/kpi/PredictionSetting/update',
    Group:{
      groupSettingsList: '/kpi/groupsettings/list/{customerId}',
      groupcontinuous:'/kpi/groupcontinuous/{KpiId}/{year}',
      getGroupByYear:'/kpi/availablegroup/{customerId}/{year}',
      getGroupSetting:'/kpi/groupsettings/{kpiSettingsId}',
      create:'/kpi/groupsettings/create',
      update:'/kpi/groupsettings/update',
      delete:'/kpi/groupsettings/delete/{kpiSettingsId}',
      getGroupKpis:'/kpi/getgroupkpis/{customerId}',
      calckpigradualsumvalue:'/kpi/calckpigradualsumvalue'
    }


	}
};
