'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {Action} from '../constants/actionType/Labeling.jsx';

var _hierNode = null;
var _industryData = null;
var _zoneData = null;
var _labelData = null;
var _customerLabelData = null;
var _benchmarkData = null;
var HIER_NODE_CHANGE_EVENT = 'hiernodechange';

var LabelMenuStore = assign({},PrototypeStore,{
  getHierNode(){
    return _hierNode;
  },
  setHierMode(hierNode){
    _hierNode = hierNode;
  },
  getBenchmarkData(){
    return _benchmarkData;
  },
  setBenchmarkData(benchmarkData){
    _benchmarkData = Immutable.fromJS(benchmarkData);
  },
  getIndustryData(){
    return _industryData;
  },
  setIndustryData(industryData){
    _industryData =  Immutable.fromJS(industryData);
  },
  getZoneData(){
    return _zoneData;
  },
  setZoneData(zoneData){
    _zoneData = Immutable.fromJS(zoneData);
  },
  getLabelData(){
    return _labelData;
  },
  setLabelData(labelData){
    _labelData =  Immutable.fromJS(labelData);
  },
  getCustomerLabelData(){
    return _customerLabelData;
  },
  setCustomerLabelData(customerLabelData){
    _customerLabelData = Immutable.fromJS(customerLabelData);
  },
  addHierNodeChangeListener: function(callback) {
    this.on(HIER_NODE_CHANGE_EVENT, callback);
  },
  emitHierNodeChange: function() {
    this.emit(HIER_NODE_CHANGE_EVENT);
  },
  removeHierNodeChangeListener: function(callback) {
    this.removeListener(HIER_NODE_CHANGE_EVENT, callback);
  },
});

LabelMenuStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.HIERNODE_CHANGED:
      LabelMenuStore.setHierMode(action.hierNode);
      LabelMenuStore.emitHierNodeChange();
      break;
    case Action.GET_ALL_INDUSTRIES_SUCCESS:
      LabelMenuStore.setIndustryData(action.industryData);
      break;
    case Action.GET_ALL_ZONES_SUCCESS:
      LabelMenuStore.setZoneData(action.zoneData);
      break;
    case Action.GET_ALL_LABELS_SUCCESS:
      LabelMenuStore.setLabelData(action.labelData);
      break;
    case Action.GET_ALL_CUSTOMER_LABELS_SUCCESS:
      LabelMenuStore.setCustomerLabelData(action.customerLabelData);
      break;
    case Action.GET_BENCHMARK_DATA_SUCCESS:
      LabelMenuStore.setBenchmarkData(action.benchmarkData);
  }
});

module.exports = LabelMenuStore;
