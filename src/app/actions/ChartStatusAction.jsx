'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/ChartStatus.jsx';

let ChartStatusAction = {
  initStatus() {
    //
  },
  modifySingleStatus() {
    //
  },
  setWidgetDto(widgetDto) {
    AppDispatcher.dispatch({
      type: Action.SET_WIDGETDTO,
      widgetDto: widgetDto
    });
  },
  // onEnergyDataLoaded(energyData) {
  //   AppDispatcher.dispatch({
  //     type: Action.CHART_STATUS_ENERGYDATA_LOADED,
  //     energyData: energyData
  //   });
  // }

};
module.exports = ChartStatusAction;
