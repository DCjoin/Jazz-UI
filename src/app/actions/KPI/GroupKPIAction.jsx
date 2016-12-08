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
  },
  getBuildingListByCustomerId(customerId,info) {
    Ajax.get(util.replacePathParams(Path.Hierarchy.GetBuildingList, customerId), {
      params: {customerId},
      success: function(buildingList) {

        AppDispatcher.dispatch({
          type: Action.GET_KPI_BUILDING_LIST_BY_CUSTOMER_ID,
          data: buildingList,
          info
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getGroupSettings(kpiSettingsId){
    Ajax.get(util.replacePathParams(Path.KPI.getGroupSetting,kpiSettingsId),
    {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_GROUP_SETTINGS,
          data: resBody
        });
      },
      error: function() {}
    });
  },
  merge(data){
    AppDispatcher.dispatch({
      type: Action.MERGE_KPI_GROUP_INFO,
      data: data
    });
  },
}

export default GroupKPIAction;
