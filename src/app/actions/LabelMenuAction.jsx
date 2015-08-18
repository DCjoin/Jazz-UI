'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import {Action} from '../constants/actionType/Labeling.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';


let LabelMenuAction = {
  setHierNode(hierNode){
    AppDispatcher.dispatch({
        type: Action.HIERNODE_CHANGED,
        hierNode: hierNode
    });
  },
  getAllIndustries(){
    Ajax.post('/Administration.svc/GetAllIndustries', {
      params: {includeRoot:true,onlyLeaf:false},
      success: function(industryData){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_INDUSTRIES_SUCCESS,
            industryData: industryData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_INDUSTRIES_ERROR
        });
      }
    });
  },
  getAllZones(){
    Ajax.post('/Administration.svc/GetAllZones', {
      params: {includeRoot:true},
      success: function(zoneData){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_ZONES_SUCCESS,
            zoneData: zoneData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_ZONES_ERROR
        });
      }
    });
  },
  getAllLabels(){
    Ajax.post('/Administration.svc/GetAllLabelings', {
      params: {},
      success: function(labelData){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_LABELS_SUCCESS,
            labelData: labelData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_LABELS_ERROR
        });
      }
    });
  },
  getCustomerLabels(){
    Ajax.post('/Customer.svc/GetCustomerLabellings', {
      params: {filter:{CustomerId:parseInt(window.currentCustomerId)}},
      success: function(customerLabelData){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_CUSTOMER_LABELS_SUCCESS,
            customerLabelData: customerLabelData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
            type: Action.GET_ALL_CUSTOMER_LABELS_ERROR
        });
      }
    });
  }
};

module.exports = LabelMenuAction;
