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
let BASCI_PAGE_DATA = 'basic_page_data',
    _building=null,
    _industry=null,
    _zone=null;

var DataQualityMaintenanceStore = assign({},PrototypeStore,{
  requestVEEDataStructure() {
    _VEEDataStructure = _VEEDataStructure.set('_loading', true);
  },
  setVEEDataStructure(data){
    _VEEDataStructure = Immutable.fromJS(data);
  },
  getDataNodeById(id){
    var node=null;
    var f=(data)=>{
      if(data.get("Id")===id){
        node=data
      }else if(data.get("Children") && data.get("Children").size>0){
        data.get("Children").forEach(child=>{f(child)})
      }
    }
    if(_VEEDataStructure.size!==0 && !_VEEDataStructure.get('_loading') && _VEEDataStructure.get('Tree').size>0){_VEEDataStructure.getIn(['Tree', 0, 'Children']).forEach(child=>{f(child)});}
    return node
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
  setBuilding(data){
    _building=Immutable.fromJS(data)
  },
  getBuilding(){
    return _building
  },
  setIndustry(data){
    _industry=data
  },
  getIndustry(){
    return _industry
  },
  setZone(data){
    _zone=data
  },
  getZone(){
    return _zone
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
      case Action.GET_BUILDING_BASIC_SUCCESS:
        DataQualityMaintenanceStore.setBuilding(action.data);
        DataQualityMaintenanceStore.emitChange();
        break;
      case Action.GET_ALL_INDUSTRIES_FOR_DATAQUALITY:
        DataQualityMaintenanceStore.setIndustry(action.data);
        break;
      case Action.GET_ALL_ZONES_FOR_DATAQUALITY:
        DataQualityMaintenanceStore.setZone(action.data);
        break;
    }
});

module.exports = DataQualityMaintenanceStore;
