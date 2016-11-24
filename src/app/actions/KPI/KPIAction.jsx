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
  }
}

export default KPIAction;
