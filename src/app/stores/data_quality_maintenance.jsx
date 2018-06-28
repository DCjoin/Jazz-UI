'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/data_quality_maintenance.jsx';

let _VEEDataStructure = Immutable.fromJS({});

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
    }
});

module.exports = DataQualityMaintenanceStore;
