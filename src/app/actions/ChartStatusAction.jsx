'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/ChartStatus.jsx';

let ChartStatusAction = {
  initStatus() {
    //
  },
  modifySingleStatus(id, name, value) {
    //
    AppDispatcher.dispatch({
      type: Action.MODIFY_SINGLE_STATUS,
      id: id,
      name: name,
      value: value
    });
  },
  modifyChartType(chartType) {
    //
    AppDispatcher.dispatch({
      type: Action.MODIFY_CHART_TYPE,
      chartType: chartType,
    });
  },
  setWidgetDto(widgetDto, bizType, energyType, chartType) {
    AppDispatcher.dispatch({
      type: Action.SET_WIDGETDTO,
      widgetDto: widgetDto,
      bizType: bizType,
      energyType: energyType,
      chartType: chartType
    });
  },
  clearStatus() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_STATUS
    });
  }
  // onEnergyDataLoaded(energyData) {
  //   AppDispatcher.dispatch({
  //     type: Action.CHART_STATUS_ENERGYDATA_LOADED,
  //     energyData: energyData
  //   });
  // }

};
module.exports = ChartStatusAction;
