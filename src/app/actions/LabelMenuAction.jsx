'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Labeling.jsx';
import { DataConverter } from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';


let LabelMenuAction = {
  setHierNode(hierNode) {
    AppDispatcher.dispatch({
      type: Action.HIERNODE_CHANGED,
      hierNode: hierNode
    });
  },
  getHierNodes(hierIds) {
    Ajax.post('/Hierarchy/GetHierarchyByIds', {
      params: {
        ids: hierIds
      },
      success: function(hierNodes) {
        AppDispatcher.dispatch({
          type: Action.GET_HIERNODES_BY_ID_SUCCESS,
          hierNodes: hierNodes
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_HIERNODES_BY_ID_ERROR
        });
      }
    });
  },
  getAllIndustries() {
    Ajax.post('/Administration/GetAllIndustries', {
      params: {
        includeRoot: true,
        onlyLeaf: false
      },
      success: function(industryData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_SUCCESS,
          industryData: industryData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_ERROR
        });
      }
    });
  },
  getAllZones() {
    Ajax.post('/Administration/GetAllZones', {
      params: {
        includeRoot: true
      },
      success: function(zoneData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_SUCCESS,
          zoneData: zoneData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_ERROR
        });
      }
    });
  },
  getAllLabels() {
    Ajax.post('/Administration/GetAllLabelings', {
      params: {},
      success: function(labelData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_LABELS_SUCCESS,
          labelData: labelData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_LABELS_ERROR
        });
      }
    });
  },
  getAllBenchmarks() {
    Ajax.post('/Administration/GetAllBenchmarks', {
      params: {},
      success: function(benchmarkData) {
        AppDispatcher.dispatch({
          type: Action.GET_BENCHMARK_DATA_SUCCESS,
          benchmarkData: benchmarkData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_BENCHMARK_DATA_ERROR
        });
      }
    });
  },
  getCustomerLabels() {
    Ajax.post('/Customer/GetCustomerLabellings', {
      params: {
        filter: {
          CustomerId: parseInt(window.currentCustomerId)
        }
      },
      success: function(customerLabelData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_CUSTOMER_LABELS_SUCCESS,
          customerLabelData: customerLabelData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_CUSTOMER_LABELS_ERROR
        });
      }
    });
  }
};

module.exports = LabelMenuAction;
