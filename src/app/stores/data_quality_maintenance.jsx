'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/data_quality_maintenance.jsx';
import { couldStartTrivia } from '../../../node_modules/typescript';

let _VEEDataStructure = Immutable.fromJS({}),
    _VEETagAnomaly = Immutable.fromJS({}),
    _scanSwitch = Immutable.fromJS({}),
    _VEESummary=Immutable.fromJS([]),
    _rule=Immutable.fromJS({}),
    _hierarchys=null,
    _tags=null;
// 基础属性
let BASCI_PAGE_DATA = 'basic_page_data';

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
  },
  setHierarchys(data){
    _hierarchys=Immutable.fromJS(data)
  },
  getHierarchys(){
    return _hierarchys
  },
  setTags(data){
    _tags=Immutable.fromJS(data)
  },
  getTags(){
    return _tags
  },
   // 基础属性
   addListDataListener(callback) {
    this.on(BASCI_PAGE_DATA, callback);
  },
  removeListDataListener(callback) {
    this.removeListener(BASCI_PAGE_DATA, callback);
  },
  emitListDataChange(args) {
    this.emit(BASCI_PAGE_DATA, args);
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
      case Action.UPDATE_READ_STATUS_SUCCESS:
        DataQualityMaintenanceStore.updateReadStatus(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_RULE_BY_ID_SUCCESS:
        DataQualityMaintenanceStore.setRule(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_TAG_SELECT_HIERARCHY_SUCCESS:
        DataQualityMaintenanceStore.setHierarchys(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_DATA_STRUCTURE_TAGS:
        DataQualityMaintenanceStore.setTags(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      // 基础属性页面数据
      case Action.GET_BASIC_PROPERTY_DATA:
        DataQualityMaintenanceStore.emitListDataChange(action.data);
        break;
    }
});

module.exports = DataQualityMaintenanceStore;
