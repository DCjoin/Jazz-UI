import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';


const SingleKPIAction = {
    customerCurrentYear(customerId) {
      Ajax.get(util.replacePathParams(Path.KPI.customerCurrentYear, customerId),
      {
        success: function(resBody) {
          AppDispatcher.dispatch({
            type: Action.CUSTOMER_CURRENT_YEAR,
            data: resBody
          });
        },
        error: function() {}
      });
    },
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
  notNeedRank() {
    AppDispatcher.dispatch({
      type: Action.NOT_NEED_RANK,
    });
  },
  getGroupKPIBuildingRank(customerId, GroupKpiId, buildingId, year) {
    // if(GroupKpiId) {
    //   buildingId = null;
    // }
    // if(buildingId) {
    //   GroupKpiId = null;
    // }
    Ajax.get(
      util.replacePathParams(
        Path.KPI.Rank.getGroupKPIBuildingRank,
        customerId,
        GroupKpiId,
        buildingId,
        year), {
      success: (resBody) => {
        AppDispatcher.dispatch({
          type: Action.GET_GROUP_KPI_BUILDING_RANK,
          data: resBody
        });
      }
    });
  },
  getBuildingRank(customerId, buildingId, year) {
    Ajax.get(
      util.replacePathParams(
        Path.KPI.Rank.getBuildingRank,
        customerId,
        buildingId,
        year), {
      success: (resBody) => {
        AppDispatcher.dispatch({
          type: Action.GET_BUILDING_RANK,
          data: resBody
        });
      }
    });
  },
  getCustomerRank(customerId, year) {
    Ajax.get(
      util.replacePathParams(
        Path.KPI.Rank.getGroupRank,
        customerId,
        year), {
      success: (resBody) => {
        AppDispatcher.dispatch({
          type: Action.GET_GROUP_RANK,
          data: resBody
        });
      }
    });
  },
  initKPIChartData() {
    AppDispatcher.dispatch({
      type: Action.INIT_KPI_CHART_DATA,
    });
  },
  emptyKPIChartData() {
    AppDispatcher.dispatch({
      type: Action.EMPTY_KPI_CHART_DATA,
    });
  },
  getKPIConfigured(CustomerId, Year, HierarchyId, GroupKpiId, getKPIRank) {
    let getKPIChart = this.getKPIChart;
    let getKPIChartSummary = this.getKPIChartSummary;
    let getKPIPeriodByYear = this.getKPIPeriodByYear;
    let emptyKPIChartData = this.emptyKPIChartData;
    this.initKPIChartData();
    Ajax.get(util.replacePathParams(Path.KPI.getKPIConfigured, GroupKpiId?null:HierarchyId, GroupKpiId), {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_CONFIGURED,
          data: resBody
        });
        if(resBody && resBody.length > 0) {
          let year = Year || SingleKPIStore.getKPIDefaultYear();
          getKPIChart(GroupKpiId, year, HierarchyId);
          getKPIChartSummary(CustomerId, year, HierarchyId, GroupKpiId);
          getKPIPeriodByYear(CustomerId, year);
          getKPIRank(year);
        } else {
          emptyKPIChartData();
        }
      },
      error: function() {}
    });
  },
  getKPIChart(GroupKpiId, Year, HierarchyId) {
    if(GroupKpiId) {
      HierarchyId = null;
    }
    if(HierarchyId) {
      GroupKpiId = null;
    }
    Ajax.get(util.replacePathParams(Path.KPI.getKPIChart, GroupKpiId, Year, HierarchyId), {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_CHART,
          data: resBody
        });
      },
      error: function() {}
    });
  },
  getKPIChartSummary(CustomerId, Year, HierarchyId, GroupKpiId) {
    //for test
    // var result = [{
    //     actual: ['5.8万'],
    //     target: ['6万', '103%'],
    //   }, {
    //     Overproof: true,
    //     actual: ['8%', '5.8万'],
    //     target: ['7%', '5.6万'],
    //   }];
    //     AppDispatcher.dispatch({
    //       type: Action.GET_KPI_CHART_SUMMARY,
    //       data: result
    //     });
    Ajax.get(util.replacePathParams(Path.KPI.getKPIChartSummary, CustomerId, Year, HierarchyId, GroupKpiId), {
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
      type: Action.MERGE_KPI_SINGLE_INFO,
      data: data
    });
  },
  getCalcValue(param){
    var url = Path.KPI.getCalcValue;
    Ajax.post(url,
      {
      params: {
          ...param
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
  fillMonthValue(value){
    var res=SingleKPIStore.fillMonthValue(value);
     AppDispatcher.dispatch({
        type: Action.GET_CALC_VALUE,
        data: res
       });
  },
  IsAutoCalculable(customerId,tagId,year,index){
    Ajax.get(util.replacePathParams(Path.KPI.IsAutoCalculable,customerId,tagId,year),
      {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.IS_AUTO_CALCUL_ABLE,
          data: {
            has:resBody,
            year,
          },
          index
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
          year: resBody.AdvanceSettings.Year
        });
      },
      error: function(err, res) {
        let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),kpiInfo.IndicatorName,`“在${HierarchyName}下”`);
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
          year: resBody.AdvanceSettings.Year
        });
      },
      error: function(err, res) {
        let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),kpiInfo.IndicatorName,`“在${kpiInfo.HierarchyName}下”`);
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

  cleanActuality() {
    AppDispatcher.dispatch({
      type: Action.CLEAN_ACTUALITY,
    });
    this.initKPIChartData();
  },

  getKpiRankByYear(customerId, groupKPIId, year, rankType, idx) {
    Ajax.get(`/rank/groupkpirank/${customerId}/${groupKPIId}/${year}/525600/${rankType}`, {
      avoidDuplicate: true,
      tag: 'getKpiRankByYear_' + groupKPIId + '_' + rankType,
      success: (resBody) => {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_RANK_BY_YEAR,
          data: resBody,
          idx
        });
      }
    })
  }
}

export default SingleKPIAction;
