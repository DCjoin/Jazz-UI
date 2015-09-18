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
  setWidgetDto(widgetDto, bizType, energyType) {
    AppDispatcher.dispatch({
      type: Action.SET_WIDGETDTO,
      widgetDto: widgetDto,
      bizType: bizType,
      energyType: energyType
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
