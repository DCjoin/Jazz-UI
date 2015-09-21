'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Energy.jsx';
import { DataConverter } from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';

let MultiTimespanAction = {
  initMultiTimespanData(relativeType, startDate, endDate) {
    AppDispatcher.dispatch({
      type: Action.INIT_MULTITIMESPAN_DATA,
      relativeType: relativeType,
      startDate: startDate,
      endDate: endDate
    });
  },
  addMultiTimespanData() {
    AppDispatcher.dispatch({
      type: Action.ADD_MULTITIMESPAN_DATA
    });
  },
  removeMultiTimespanData(compareIndex) {
    AppDispatcher.dispatch({
      type: Action.REMOVE_MULTITIMESPAN_DATA,
      compareIndex: compareIndex
    });
  },
  handleRelativeTypeChange(isOriginalDate, relativeType, compareIndex) {
    AppDispatcher.dispatch({
      type: Action.RELATIVE_TYPE_CHANGE,
      isOriginalDate: isOriginalDate,
      relativeType: relativeType,
      compareIndex: compareIndex
    });
  },
  handleRelativeValueChange(relativeValue, compareIndex) {
    AppDispatcher.dispatch({
      type: Action.RELATIVE_VALUE_CHANGE,
      relativeValue: relativeValue,
      compareIndex: compareIndex
    });
  },
  handleDateTimeSelectorChange(isOriginalDate, compareIndex, startDate, endDate, isStart) {
    AppDispatcher.dispatch({
      type: Action.DATETIME_SELECTOR_CHANGE,
      isOriginalDate: isOriginalDate,
      compareIndex: compareIndex,
      startDate: startDate,
      endDate: endDate,
      isStart: isStart
    });
  },
  clearMultiTimespan(type) {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.CLEAR_MULTI_TIMESPAN,
        dateType: type
      });
    }, 0);
  },
  convert2Stable() {
    AppDispatcher.dispatch({
      type: Action.CONVERT_TEMP_TO_STABLE
    });
  }
};
module.exports = MultiTimespanAction;
