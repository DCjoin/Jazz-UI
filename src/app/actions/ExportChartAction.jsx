'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import ActionTypes from '../constants/actionType/Energy.jsx';

let ExportChartAction = {

  getTagsData4Export(params, path){
    AppDispatcher.dispatch({
        type: ActionTypes.EXPORT_CHART_ACTION_TYPE,
        params:params,
        path: path
    });
  }

};
module.exports = ExportChartAction;
