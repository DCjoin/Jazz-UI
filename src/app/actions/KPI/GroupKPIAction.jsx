import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import SingleKPIAction from './SingleKPIAction.jsx';


const GroupKPIAction = {
  getGroupSettingsList(customerId) {
    Ajax.get( util.replacePathParams(Path.KPI.Group.groupSettingsList, customerId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GROUP_SETTINGS_LIST,
          data: res,
        })
      }
    } );
  },
  getGroupContinuous(KpiId,year) {
    Ajax.get(util.replacePathParams(Path.KPI.Group.groupcontinuous, KpiId,year),
    {
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_GROUP_CONTINUOUS,
          data: resBody,
          KpiId
        });
      },
      error: function() {}
    });
  },
  getGroupByYear(customerId,year,info){
    Ajax.get(util.replacePathParams(Path.KPI.Group.getGroupByYear,customerId,year),
    {
      success: function(resBody) {
        SingleKPIAction.getKPIPeriodByYear(customerId,year);
        AppDispatcher.dispatch({
          type: Action.GET_KPI_GROUP_BY_YEAR,
          data: resBody,
          info
        });
      },
      error: function() {}
    });
  },
  getGroupKpis(customerId,Year){
    Ajax.get(util.replacePathParams(Path.KPI.Group.getGroupKpis, customerId), {
      params: {customerId},
      success: function(list) {
        SingleKPIAction.getKPIPeriodByYear(customerId,Year);
        AppDispatcher.dispatch({
          type: Action.GET_GROUP_KPIS,
          data: list,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getBuildingListByCustomerId(customerId,info) {
    var that=this;
    Ajax.get(util.replacePathParams(Path.Hierarchy.GetBuildingList, customerId), {
      params: {customerId},
      success: function(buildingList) {
        that.getGroupKpis(customerId,info.Year);
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
    Ajax.get(util.replacePathParams(Path.KPI.Group.getGroupSetting,kpiSettingsId),
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
  create(){
    var url = Path.KPI.Group.create;
    var params=GroupKPIStore.transit();
    Ajax.post(url,
      {
      params: params,
      commonErrorHandling: false,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.KPI_GROUP_SUCCESS
        });
      },
      error: function(err, res) {
        let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),params.GroupKpiSetting.IndicatorName);
        AppDispatcher.dispatch({
          type: Action.KPI_GROUP_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  update(){
    var url = Path.KPI.Group.update;
    var params=GroupKPIStore.transit();
    Ajax.post(url,
      {
      params: params,
      commonErrorHandling: false,
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.KPI_GROUP_SUCCESS
        });
      },
      error: function(err, res) {
        let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),params.GroupKpiSetting.IndicatorName);
        AppDispatcher.dispatch({
          type: Action.KPI_GROUP_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  deleteGroupSettings(kpiSettingsId, customerId, IndicatorName) {
    let getGroupSettingsList = this.getGroupSettingsList;
    Ajax.post(util.replacePathParams(Path.KPI.Group.delete, kpiSettingsId), {
      success: function() {
        getGroupSettingsList(customerId);
      },
      error: function(err, res) {
        let ErrorMsg = I18N.format(util.getErrorMessageByRes(res.text),IndicatorName);
        AppDispatcher.dispatch({
          type: Action.KPI_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
      }
    });
  },
}

export default GroupKPIAction;
