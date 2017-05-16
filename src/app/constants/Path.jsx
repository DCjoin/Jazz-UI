'use strict';

module.exports = {
  Hierarchy: {
    GetBuildingList: '/Hierarchy/GetBuildingList/{customerId}',
    getConsultants: '/user/getconsultants/{hierarchyId}',
  },
  RawData:{
    RollBack:'/energy/rollback/{tagId}'
  },
  KPI:{
		getKPIPeriod: '/kpi/getkpiperiod/{customerid}',
		setKPIPeriod: '/kpi/setkpiperiod',
		getKPIPeriodByYear: '/kpi/getkpiperiodpoint/{customerid}/{year}',
		getDimension:'/AreaDimension/GetAreaDimensionTree',
		getTags:'/Tag/GetTagsByFilter',
    getKPIConfigured: '/kpi/{HierarchyId}/{groupKpiId}/validyears',
    getKPIChart: '/KPI/chart/{groupKpiId}/{year}/{HierarchyId}',
    getKPIChartSummary: '/KPI/calcpredictsum/{customerId}/{year}/{HierarchyId}/{groupKpiId}',
    getKpi:'/kpi/settings/{kpiId}/{year}',
    getCalcValue:'/kpi/calckpigradualvalue',
    IsAutoCalculable:'/kpi/isautocalculable/{customerId}/{tagId}/{year}',
    getCalcPredicate:'/kpi/CalcKPIPredicateValue',
    createKpiReportSettings:'/kpi/settings/create',
    updateKpiReportSettings:'/kpi/settings/update',
    updatePredictionSetting:'/kpi/PredictionSetting/update',
    customerCurrentYear:'/kpi/customercurrentyear/{customerId}',
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
    },
    Rank: {
      getBuildingRank: '/rank/buildingrank/{customerId}/{buildingId}/{year}',
      getGroupKPIBuildingRank: '/rank/groupkpibuildingrank/{customerId}/{groupKpiId}/{buildingId}/{year}',
      getGroupRank: '/rank/grouprank/{customerId}/{year}',
      getRank:'/rank/getrank/{customerId}',
      setRank:'/rank/setrank',
      rankRecord:'/rank/rankrecord/{customerId}/{groupKpiId}/{rankType}/{buildingId}/{year}',
    }
	},
  DataReport: {
    getExportByHierarchyId: '/DataReport/GetExportByHierarchyId',
    templateReference:'/datareport/TemplateReference/{templateName}/{customerId}'
  },
  DataAnalysis:{
    getWidgetGatherInfo:'/Widget/GetWidgetGatherInfo'
  },
  ECM:{
    getEnergysolution:'/energysolution/{hierarchyId}/{status}/{smallSize}/{size}',
    pushProblem:'/energysolution/problem/push',
    deleteProblem:'/energysolution/problem/delete/{problemId}',
    updateSolution:'/energysolution/update',
    getSupervisor:'/energysolution/supervisor/{hierarchyId}',
    saveSupervisor:'/energysolution/supervisor',
    assignSupervisor:'/energysolution/problem/supervisor/assignation/{problemId}/{supervisorId}',
    activecounts:'/energysolution/problem/activecounts/{hierarchyId}',
    containsunread:'/energysolution/problem/containsunread/{hierarchyId}',
    readProblem:'/energysolution/problem/read/{problemId}',
    remarkList:'/energysolution/problem/remark/{problemId}',
    addRemark:'/energysolution/problem/remark',
    deleteRemark:'/energysolution/problem/remark/delete/{remarkId}',
    deleteSupervisor:'/energysolution/problem/supervisor/delete/{supervisorId}',
  },
  Diagnose:{
    diagnosislist:'/diagnose/diagnosislist',
    getdiagnosestatic:'/diagnose/getdiagnosestatic/{hierarchId}',
    getDiagnose:'/diagnose/get/{diagnoseId}',
    deletediagnose:'/diagnose/deletediagnose/{diagnoseId}',
    getdiagnosedata:'/diagnose/getdiagnosedata/{diagnoseId}',
    getproblemdata:'/diagnose/getproblemdata/{diagnoseId}',
    pauseorrecoverdiagnose:'/diagnose/pauseorrecoverdiagnose/{diagnoseId}/{status}',
    ignorediagnose:'/diagnose/ignorediagnose/{diagnoseId}',
    previewchart:'/diagnose/previewchart',
    getDiagnoseTag: '/diagnose/getdiagnosetag',
    updateDiagnose:'/diagnose/update',
    generatesolution:'/diagnose/generatesolution/{diagnoseId}',
    isconfigcalendar:'/diagnose/isconfigcalendar/{hierarchyId}',
    getConsultant: '/user/getconsultant/{hierarchyId}',
  }
};
