
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import EnergyStore from 'stores/energy/EnergyStore.jsx';
import CommonFuns from 'util/Util.jsx';
import Immutable from 'immutable';

var _gatherInfo=null,_widgetDto=null;
const DataAnalysisStore = assign({}, PrototypeStore, {
  setGatherInfo(data){
    _gatherInfo=data
  },
  getGatherInfo(){
    return _gatherInfo
  },
  getCalendarDisabled(chartType) {
    let tagOptions = EnergyStore.getTagOpions();
    if (!tagOptions) {
      return false;
    }
    let paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

      let disabled = false;

      if (timeRanges.length > 1) {
        disabled = true;
      } else if (tagOptions.length > 1) {
        let hierId = null;
        tagOptions.forEach(option => {
          if (!hierId) {
        hierId = option.hierId;
      } else if (hierId !== option.hierId) {
        disabled = true;
        return;
      }
    });
  }
  if (chartType === 'pie' || chartType === 'rawdata') {
    disabled = true;
  }
  return disabled;
},

  getDisplayDate(time, isEndTime) {
    if (time !== null) {
      var hour = time.getHours();
      if (hour === 0 && isEndTime) {
        time = CommonFuns.dateAdd(time, -1, 'days');
        hour = 24;
      }
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var day = time.getDate();

      return year + '/' + month + '/' + day + ' ' + hour + ':00';
    } else {
      return '';
    }
  },
  setInitialWidgetDto(dto){
    _widgetDto=Immutable.fromJS(dto);
  },
  getInitialWidgetDto(){
    return _widgetDto;
  },
  dispose(){
    _gatherInfo=null;
    _widgetDto=null;
  }

});

DataAnalysisStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_WIDGET_GATHER_INFO:
          DataAnalysisStore.setGatherInfo(action.data);
          DataAnalysisStore.emitChange()
      break;
    case Action.SET_INITIAL_WIDGET_DTO:
          DataAnalysisStore.setInitialWidgetDto(action.dto);
    default:
  }
});

export default DataAnalysisStore;
