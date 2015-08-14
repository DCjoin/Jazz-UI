'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {Action} from '../constants/actionType/Labeling.jsx';

var _industryData = null;
var _zoneData = null;
var _labelData = null;
var _customerLabelData = null;

var LabelMenuStore = assign({},PrototypeStore,{
  getIndustryData(){
    return _industryData;
  },
  setIndustryData(industryData){
    _industryData =  industryData;
  },
  getZoneData(){
    return _zoneData;
  },
  setZoneData(zoneData){
    _zoneData =  zoneData;
  },
  getLabelData(){
    return _zoneData;
  },
  setLabelData(labelData){
    _labelData =  labelData;
  },
  getCustomerLabelData(){
    return _customerLabelData;
  },
  setCustomerLabelData(customerLabelData){
    _customerLabelData =  customerLabelData;
  },
});

LabelMenuStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GET_ALL_INDUSTRIES_SUCCESS:
      LabelMenuStore.setIndustryData(action.industryData);
      LabelMenuStore.emitChange();
      break;
    case Action.GET_ALL_ZONES_SUCCESS:
      LabelMenuStore.setZoneData(action.zoneData);
      LabelMenuStore.emitChange();
      break;
    case Action.GET_ALL_LABELS_SUCCESS:
      LabelMenuStore.setLabelData(action.labelData);
      LabelMenuStore.emitChange();
      break;
    case Action.GET_ALL_CUSTOMER_LABELS_SUCCESS:
      LabelMenuStore.setCustomerLabelData(action.customerLabelData);
      LabelMenuStore.emitChange();
      break;
  }
});

module.exports = LabelMenuStore;
