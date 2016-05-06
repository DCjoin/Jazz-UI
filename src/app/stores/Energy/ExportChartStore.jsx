'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../../constants/actionType/Energy.jsx';

let _paramsObj = null;
let _path = null;
var ExportChartStore = assign({}, PrototypeStore, {
  initExportParams(params, path) {
    _paramsObj = params;
    _path = path;
  },
  getExportParamsObj() {
    return _paramsObj;
  },
  getPath() {
    return _path;
  }
});
module.exports = ExportChartStore;

ExportChartStore.dispatchToken = PopAppDispatcher.register(function(action) {
  if (action.type === Action.EXPORT_CHART_ACTION_TYPE) {
    ExportChartStore.initExportParams(action.params, action.path);
    ExportChartStore.emitChange();
  }
});
