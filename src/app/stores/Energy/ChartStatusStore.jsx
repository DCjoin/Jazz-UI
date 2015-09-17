'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/ChartStatus.jsx';

let _chartSeriesStatus = null;
let _energyData = null;
let _widgetDto = null;
let _isInitedByWidget = false;

let ChartStatusStore = assign({}, PrototypeStore, {
  initStatus() {
    //
  },
  modifySingleStatus(name, value, index) {
    //
  },
  setWidgetDto(widgetDto) {
    _widgetDto = widgetDto;
    _isInitedByWidget = false;
  },
  onEnergyDataLoaded(energyData) {
    _energyData = energyData;
  },
  getSeriesStatus() {
    return _chartSeriesStatus;
  }
});

ChartStatusStore.dispatchToken = PopAppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.SET_WIDGET_INIT_STATE:
      ChartStatusStore.setWidgetDto(action.widgetDto);
      break;
  }
});

module.exports = ChartStatusStore;
