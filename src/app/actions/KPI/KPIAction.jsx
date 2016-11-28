import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';


const KPIAction = {
  	getKPIPeriod(customerId) {
		Ajax.get(util.replacePathParams(Path.KPI.getKPIPeriod, customerId),
		{
			success: function(resBody) {
				AppDispatcher.dispatch({
					type: Action.GET_QUOTAPERIOD,
					data: resBody
				});
			},
			error: function() {}
		});
	},
  	setKPIPeriod(data) {
		Ajax.post(Path.KPI.setKPIPeriod,
		{
			params: data,
			success: function(resBody) {
				AppDispatcher.dispatch({
					type: Action.GET_QUOTAPERIOD,
					data: resBody
				});
			},
			error: function() {}
		});
	},
  getKPIPeriodByYear(customerId,year) {
    Ajax.get(util.replacePathParams(Path.KPI.getKPIPeriodByYear, customerId,year),
      {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_QUOTAPERIOD_BY_YEAR,
          data: resBody
        });
      },
      error: function() {}
    });
  },
  getKPI(kpiId,year){
    Ajax.get(util.replacePathParams(Path.KPI.getKpi, kpiId,year),
    	{
			success: function(resBody) {
				AppDispatcher.dispatch({
					type: Action.GET_KPI_INFO_SUCCESS,
					data: resBody
				});
			},
			error: function() {}
		});
  },
  initKPIChartData() {
    AppDispatcher.dispatch({
      type: Action.INIT_KPI_CHART_DATA,
    });
  },
  getKPIConfigured(CustomerId, HierarchyId, Year) {
    let getKPIChart = this.getKPIChart;
    let getKPIChartSummary = this.getKPIChartSummary;
    let initKPIChartData = this.initKPIChartData;
    Ajax.get(util.replacePathParams(Path.KPI.getKPIConfigured, CustomerId, HierarchyId), {
      success: function(resBody) {
        if(resBody) {
          initKPIChartData();
          getKPIChart(CustomerId, Year, HierarchyId);
          getKPIChartSummary(CustomerId, Year, HierarchyId);
        } else {
          AppDispatcher.dispatch({
            type: Action.GET_KPI_CHART,
            data: null
          });          
        }
      },
      error: function() {}
    });
  },
  getKPIChart(CustomerId, Year, HierarchyId) {
    Ajax.get(util.replacePathParams(Path.KPI.getKPIChart, CustomerId, HierarchyId, Year), {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_CHART,
          data: resBody
        });
      },
      error: function() {}
    });    
  },
  getKPIChartSummary(CustomerId, Year, HierarchyId) {
    Ajax.get(util.replacePathParams(Path.KPI.getKPIChartSummary, CustomerId, HierarchyId, Year), {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_CHART_SUMMARY,
          data: resBody
        });
      },
      error: function() {}
    });    
  },
  merge(data){
    AppDispatcher.dispatch({
      type: Action.MERGE_KPI_INFO,
      data: data
    });
  },
  getCalcValue(Year,QuotaType,IndexValue,RatioValues){
    var url = Path.APISubPaths.KPI.getCalcValue;
    Ajax.post(url,
      {
      params: {
          Year,QuotaType,IndexValue,RatioValues
        },
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_CALC_VALUE,
          data: resBody
        });
      },
      error: function() {}
    });
  },
  IsAutoCalculable(tagId,year){
    Ajax.get(util.replacePathParams(Path.KPI.IsAutoCalculable,tagId,year),
      {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.IS_AUTO_CALCUL_ABLE,
          data: {
            has:resBody,
            year,
          }
        });
      },
      error: function() {}
    });
  },
  getCalcPredicate(CustomerId,Year,TagRatios){
    var url = Path.KPI.getCalcPredicate;
    Ajax.post(url,
      {
      params: {
          CustomerId,Year,TagRatios
        },
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_CALC_PREDICATE,
          data: resBody
        });
      },
      error: function() {}
    });
  },
  createKpi(CustomerId,HierarchyId,HierarchyName,kpiInfo){
    var url = Path.KPI.createKpiReportSettings;
    Ajax.post(url,
      {
      params: {
          CustomerId,HierarchyId,HierarchyName,
          ...kpiInfo
        },
      commonErrorHandling: false,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.KPI_SUCCESS,
          data: resBody
        });
      },
      error: function(err, res) {
        let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),HierarchyName);
        AppDispatcher.dispatch({
          type: Action.KPI_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  updateKpi(kpiInfo){
    var url = Path.KPI.updateKpiReportSettings;
    Ajax.post(url,
      {
      params: {
          ...kpiInfo
        },
      commonErrorHandling: false,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.KPI_SUCCESS,
          data: resBody
        });
      },
      error: function(err, res) {
        let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),kpiInfo.HierarchyName);
        AppDispatcher.dispatch({
          type: Action.KPI_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  updatePrediction(info){
    var url = Path.KPI.updatePredictionSetting;
    Ajax.post(url,
      {
      params: {
          ...info
        },
      commonErrorHandling: false,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.KPI_SUCCESS,
          data: resBody
        });
      },
      error: function(err, res) {
        // let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),HierarchyName);
        // AppDispatcher.dispatch({
        //   type: Action.KPI_ERROR,
        //   title: I18N.Platform.ServiceProvider.ErrorNotice,
        //   content: ErrorMsg,
        // });
        console.log(err, res);
      }
    });
  },
}

export default KPIAction;
