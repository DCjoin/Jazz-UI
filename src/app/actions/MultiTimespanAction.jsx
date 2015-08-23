'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import {Action} from '../constants/actionType/Energy.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';

let MultiTimespanAction = {
  initMultiTimaspanData(relativeType, startDate, endDate){
    AppDispatcher.dispatch({
         type: Action.INIT_MULTITIMESPAN_DATA,
         relativeType: relativeType,
         startDate: startDate,
         endDate: endDate
    });
  }
};
module.exports = MultiTimespanAction;
