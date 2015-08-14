'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import {Action} from '../constants/actionType/Labeling.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';


let LabelMenuAction = {
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
    Ajax.post('/Administration.svc/GetCustomerLabellings', {
      params: {},
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
