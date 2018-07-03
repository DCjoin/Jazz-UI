'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/data_quality_maintenance.jsx';

let _VEEDataStructure = Immutable.fromJS({}),
    _VEETagAnomaly = Immutable.fromJS({});

var DataQualityMaintenanceStore = assign({},PrototypeStore,{
  requestVEEDataStructure() {
    _VEEDataStructure = _VEEDataStructure.set('_loading', true);
  },
  setVEEDataStructure(data){
    _VEEDataStructure = Immutable.fromJS(data);
  },
  getVEEDataStructure(){
    return _VEEDataStructure;
  },
  setVEETagAnomaly(data){
    _VEETagAnomaly = Immutable.fromJS(data);
  },
  getVEETagAnomaly(){
    return _VEETagAnomaly;
  },
});

DataQualityMaintenanceStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_VEE_DATA_STRUCTURE_REQUEST:
        DataQualityMaintenanceStore.requestVEEDataStructure();
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_VEE_DATA_STRUCTURE_SUCCESS:
        DataQualityMaintenanceStore.setVEEDataStructure(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_VEE_TAG_ANOMALY_SUCCESS:
        DataQualityMaintenanceStore.setVEETagAnomaly(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
    }
});

module.exports = DataQualityMaintenanceStore;
