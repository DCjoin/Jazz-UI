'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/data_quality_maintenance.jsx';

let _VEEDataStructure = Immutable.fromJS({}),
    _VEETagAnomaly = Immutable.fromJS({}),
     _scanSwitch = Immutable.fromJS({}),
    _VEESummary=Immutable.fromJS([]);
   


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
  requestScanSwitch() {
    _scanSwitch = _scanSwitch.set('_loading', true);
  },
  setScanSwitch(data){
    _scanSwitch = Immutable.fromJS(data);
  },
  getScanSwitch(){
    return _scanSwitch;
  },
  setVEETagAnomaly(data){
    _VEETagAnomaly = Immutable.fromJS(data);
  },
  getVEETagAnomaly(){
    return _VEETagAnomaly;
  },
  setVEESummary(data){
    _VEESummary = Immutable.fromJS(data);
  },
  getVEESummary(){
    return _VEESummary;
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
      case Action.GET_SCAN_SWITCH_REQUEST:
        DataQualityMaintenanceStore.requestScanSwitch();
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_SCAN_SWITCH_SUCCESS:
        DataQualityMaintenanceStore.setScanSwitch(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_VEE_TAG_ANOMALY_SUCCESS:
        DataQualityMaintenanceStore.setVEETagAnomaly(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_VEE_SUMMARY_SUCCESS:
        DataQualityMaintenanceStore.setVEESummary(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
    }
});

module.exports = DataQualityMaintenanceStore;
