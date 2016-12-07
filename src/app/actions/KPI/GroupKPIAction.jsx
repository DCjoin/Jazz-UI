import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';
import GroupKPIStore from 'stores/KPI/SingleKPIStore.jsx';


const GroupKPIAction = {
  getGroupContinuous(KpiId,year) {
    Ajax.get(util.replacePathParams(Path.KPI.groupcontinuous, KpiId,year),
    {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_GROUP_CONTINUOUS,
          data: resBody
        });
      },
      error: function() {}
    });
  },
  getGroupByYear(customerId,year){
    Ajax.get(util.replacePathParams(Path.KPI.getGroupByYear,customerId,year),
    {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_GROUP_BY_YEAR,
          data: resBody
        });
      },
      error: function() {}
    });
  }
  }

export default GroupKPIAction;
