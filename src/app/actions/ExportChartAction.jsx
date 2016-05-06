'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Energy.jsx';
//import Path from '../constants/Path.jsx';
import Config from 'config';

let ExportChartAction = {

  getTagsData4Export(params, path) {
    let fullPath = Config.ServeAddress + Config.APIBasePath + path;
    AppDispatcher.dispatch({
      type: Action.EXPORT_CHART_ACTION_TYPE,
      params: params,
      path: fullPath
    });
  }

};
module.exports = ExportChartAction;
