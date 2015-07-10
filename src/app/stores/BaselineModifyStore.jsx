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
  getYearData: function(){
    return _baselineModifyData.YearlyValues[0].DataValue;
  },
  setYearData: function(data){
    _baselineModifyData.YearlyValues[0].DataValue = data;
  },
  getMonthData: function(index){
    return _baselineModifyData.MonthlyValues[index].DataValue;
  },
  setMonthData: function(index, data){
    _baselineModifyData.MonthlyValues[index].DataValue = data;
  },
  getYearIsModify: function(){
    return _baselineModifyData.YearlyValues[0].IsModify;
  },
  setYearIsModify: function(){
    _baselineModifyData.YearlyValues[0].IsModify = true;
  },
  getMonthIsModify: function(index){
    return _baselineModifyData.MonthlyValues[index].IsModify;
  },
  setMonthIsModify: function(index){
    _baselineModifyData.MonthlyValues[index].IsModify = true;
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
    case Action.SET_YEAR_IS_MODIFY:
      BaselineModifyStore.setYearIsModify();
      break;
    case Action.SET_MONTH_IS_MODIFY:
      BaselineModifyStore.setMonthIsModify(action.index);
      break;
    case Action.SET_YEAR_DATA:
      BaselineModifyStore.setYearData(action.data);
      break;
    case Action.SET_MONTH_DATA:
      BaselineModifyStore.setMonthData(action.index, action.data);
      break;
  }
});

module.exports = BaselineModifyStore;
