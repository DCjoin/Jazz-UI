'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import ActionTypes from '../../constants/actionType/Energy.jsx';

let _paramsObj = null;
var ExportChartStore = assign({},PrototypeStore,{
  initExportParams(params){
    _paramsObj = params;
  },
  getExportParamsObj(){
    return _paramsObj;
  }
});
module.exports = ExportChartStore;

ExportChartStore.dispatchToken = PopAppDispatcher.register(function(action) {
  if(action.type === ActionTypes.EXPORT_CHART_ACTION_TYPE){
    ExportChartStore.initExportParams(action.params);
    ExportChartStore.emitChange();
  }
});
