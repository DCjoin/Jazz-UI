
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import EnergyStore from 'stores/energy/EnergyStore.jsx';

const DataAnalysisStore = assign({}, PrototypeStore, {
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
  }

});

DataAnalysisStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.XX:
      break;
    default:
  }
});

export default DataAnalysisStore;
