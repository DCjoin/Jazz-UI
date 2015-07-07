'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Setting.jsx';


const DATA_CHANGED_EVENT = 'datachanged',
      DATA_LOADING_EVENT = 'dataloading';
var _baselineModifyData = null,
    _isLoading = false;

var BaselineModifyStore = assign({},PrototypeStore,{
  getLoadingStatus(){
    return _isLoading;
  },
  getData: function(){
    return _baselineModifyData;
  },
  setData: function(data){
    _baselineModifyData = data;
  },
  _onDataLoading: function(){
    _isLoading = true;
  },
  _onDataChanged: function(data){
    _isLoading = false;
    this.setData(data);
  },
  addDataLoadingListener: function(callback) {
    this.on(DATA_LOADING_EVENT, callback);
  },
  emitDataLoading: function() {
    this.emit(DATA_LOADING_EVENT);
  },
  removeDataLoadingListener: function(callback) {
    this.removeListener(DATA_LOADING_EVENT, callback);
  },
  addDataChangeListener: function(callback) {
    this.on(DATA_CHANGED_EVENT, callback);
  },
  emitDataChange: function() {
    this.emit(DATA_CHANGED_EVENT);
  },
  removeDataChangeListener: function(callback) {
    this.removeListener(DATA_CHANGED_EVENT, callback);
  },
});
BaselineModifyStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GET_BASELINE_DATA_LOADING:
      BaselineModifyStore._onDataLoading();
      BaselineModifyStore.emitDataLoading();
      break;
    case Action.GET_BASELINE_DATA_SUCCESS:
      BaselineModifyStore._onDataChanged(action.modifyData);
      BaselineModifyStore.emitDataChange();
      break;
    case Action.GET_BASELINE_DATA_ERROR:
      break;
    case Action.SET_BASELINE_DATA_LOADING:
      BaselineModifyStore._onDataLoading();
      BaselineModifyStore.emitDataLoading();
      break;
    case Action.SET_BASELINE_DATA_SUCCESS:
      BaselineModifyStore._onDataChanged(action.modifyData);
      BaselineModifyStore.emitDataChange();
      break;
    case Action.SET_BASELINE_DATA_ERROR:
      break;
  }
});

module.exports = BaselineModifyStore;
