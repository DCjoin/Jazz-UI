'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Labeling.jsx';
import Folder from '../constants/actionType/Folder.jsx';
import CommodityStore from './CommodityStore.jsx';


var _hierNode = null;
var _hierNodes = [];
var _industryData = null;
var _zoneData = null;
var _labelData = null;
var _customerLabelData = null;
var _benchmarkData = null;
var HIER_NODE_CHANGE_EVENT = 'hiernodechange';
var HIER_NODES_CHANGE_EVENT = 'hiernodeschange';
var INDUSTRY_DATA_CHANGE_EVENT = 'industrydatachange';
var ZONE_DATA_CHANGE_EVENT = 'zonedatachange';
var LABEL_DATA_CHANGE_EVENT = 'labeldatachange';
var CUSTOMER_DATA_CHANGE_EVENT = 'customerdatachange';

var LabelMenuStore = assign({}, PrototypeStore, {
  getHierNode() {
    return _hierNode;
  },
  setHierNode(hierNode) {
    _hierNode = hierNode;
  },
  getHierNodes() {
    return _hierNodes;
  },
  setHierNodes(hierNodes) {
    _hierNodes = hierNodes;
  },
  clearHierNodes() {
    _hierNodes = [];
  },
  getBenchmarkData() {
    return _benchmarkData;
  },
  setBenchmarkData(benchmarkData) {
    _benchmarkData = Immutable.fromJS(benchmarkData);
  },
  getIndustryData() {
    return _industryData;
  },
  setIndustryData(industryData) {
    _industryData = Immutable.fromJS(industryData);
  },
  getZoneData() {
    return _zoneData;
  },
  setZoneData(zoneData) {
    _zoneData = Immutable.fromJS(zoneData);
  },
  getLabelData() {
    return _labelData;
  },
  setLabelData(labelData) {
    _labelData = Immutable.fromJS(labelData);
  },
  getCustomerLabelData() {
    return _customerLabelData;
  },
  setCustomerLabelData(customerLabelData) {
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
  addHierNodesChangeListener: function(callback) {
    this.on(HIER_NODES_CHANGE_EVENT, callback);
  },
  emitHierNodesChange: function() {
    this.emit(HIER_NODES_CHANGE_EVENT);
  },
  removeHierNodesChangeListener: function(callback) {
    this.removeListener(HIER_NODES_CHANGE_EVENT, callback);
  },
  addIndustryDataChangeListener: function(callback) {
    this.on(INDUSTRY_DATA_CHANGE_EVENT, callback);
  },
  emitIndustryDataChange: function() {
    this.emit(INDUSTRY_DATA_CHANGE_EVENT);
  },
  removeIndustryDataChangeListener: function(callback) {
    this.removeListener(INDUSTRY_DATA_CHANGE_EVENT, callback);
  },
  addZoneDataChangeListener: function(callback) {
    this.on(ZONE_DATA_CHANGE_EVENT, callback);
  },
  emitZoneDataChange: function() {
    this.emit(ZONE_DATA_CHANGE_EVENT);
  },
  removeZoneDataChangeListener: function(callback) {
    this.removeListener(ZONE_DATA_CHANGE_EVENT, callback);
  },
  addLabelDataChangeListener: function(callback) {
    this.on(LABEL_DATA_CHANGE_EVENT, callback);
  },
  emitLabelDataChange: function() {
    this.emit(LABEL_DATA_CHANGE_EVENT);
  },
  removeLabelDataChangeListener: function(callback) {
    this.removeListener(LABEL_DATA_CHANGE_EVENT, callback);
  },
  addCustomerDataChangeListener: function(callback) {
    this.on(CUSTOMER_DATA_CHANGE_EVENT, callback);
  },
  emitCustomerDataChange: function() {
    this.emit(CUSTOMER_DATA_CHANGE_EVENT);
  },
  removeCustomerDataChangeListener: function(callback) {
    this.removeListener(CUSTOMER_DATA_CHANGE_EVENT, callback);
  }
});

var FolderAction = Folder.Action;
LabelMenuStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.HIERNODE_CHANGED:
      LabelMenuStore.setHierNode(action.hierNode);
      LabelMenuStore.emitHierNodeChange();
      break;
    case Action.GET_ALL_INDUSTRIES_SUCCESS:
      LabelMenuStore.setIndustryData(action.industryData);
      LabelMenuStore.emitIndustryDataChange();
      break;
    case Action.GET_ALL_ZONES_SUCCESS:
      LabelMenuStore.setZoneData(action.zoneData);
      LabelMenuStore.emitZoneDataChange();
      break;
    case Action.GET_ALL_LABELS_SUCCESS:
      LabelMenuStore.setLabelData(action.labelData);
      LabelMenuStore.emitLabelDataChange();
      break;
    case Action.GET_ALL_CUSTOMER_LABELS_SUCCESS:
      LabelMenuStore.setCustomerLabelData(action.customerLabelData);
      LabelMenuStore.emitCustomerDataChange();
      break;
    case Action.GET_BENCHMARK_DATA_SUCCESS:
      LabelMenuStore.setBenchmarkData(action.benchmarkData);
      break;
    case Action.GET_HIERNODES_BY_ID_SUCCESS:
      LabelMenuStore.setHierNodes(action.hierNodes);
      LabelMenuStore.emitHierNodesChange();
      break;
    case FolderAction.CREATE_FOLDER_OR_WIDGET:
      LabelMenuStore.setHierNode(CommodityStore.getHierNode());
      break;
  }
});

module.exports = LabelMenuStore;
