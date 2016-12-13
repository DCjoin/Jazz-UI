import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import SingleKPIAction from './SingleKPIAction.jsx';


const MonthKPIAction = {
  setDefalutMonthInfo(info) {
        AppDispatcher.dispatch({
          type: Action.SET_MONTH_KPI_INFO,
          data: info,
        })
  },
  merge(data){
    AppDispatcher.dispatch({
      type: Action.MERGE_MONTH_KPI_INFO,
      data: data
    });
  },
  getCalcSumValue(param){
    var url = Path.KPI.Group.calckpigradualsumvalue;
    Ajax.post(url,
      {
      params: param,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_GROUP_CLAC_SUM_VALUE,
          data: resBody
        });
      },
      error: function() {}
    });
  },
}

export default MonthKPIAction;
