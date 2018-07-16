'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/data_quality_maintenance.jsx';

let _VEEDataStructure = Immutable.fromJS({}),
    _VEETagAnomaly = Immutable.fromJS({}),
     _scanSwitch = Immutable.fromJS({}),
    _VEESummary=Immutable.fromJS([]),
    _rule=Immutable.fromJS({});
   


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
  updateReadStatus(node){
    var tempStructure=_VEEDataStructure.getIn(['Tree', 0, 'Children']).toJS();
    var f=(data)=>{
      if(data.Id===node.get("Id") && data.NodeType===node.get("NodeType")){
        data.IsNotRead=false
      }else{
        if(data.Children){
          data.Children.forEach(child=>f(child))
        }
      }
    }
    tempStructure.forEach(structure=>f(structure));
    _VEEDataStructure=_VEEDataStructure.setIn(['Tree', 0, 'Children'],Immutable.fromJS(tempStructure))
  },
  setRule(rule){
    _rule=Immutable.fromJS(rule)
  },
  getRule(){
    return _rule
  }
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
      case Action.UPDATE_READ_STATUS_SUCCESS:
        DataQualityMaintenanceStore.updateReadStatus(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_RULE_BY_ID_SUCCESS:
        DataQualityMaintenanceStore.setRule(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
    }
});

module.exports = DataQualityMaintenanceStore;
