'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from './../util/Util.jsx';
import ActionTypes from './../constants/actionType/Carbon.jsx';
import ChartReaderStrategyFactor from './Energy/ChartReaderStrategyFactor.jsx';

let _isLoading = false,
    _carbonData = null,
    _carbonRawData = null,
    _submitParams = null,
    _paramsObj = null,
    _commOptions = null,
    _chartTitle = null,
    _relativeDate = null,
    _errorCode = null,
    _errorMessage = null,
    _destination = 2;

const CARBON_DATA_LOADING_EVENT = 'carbondataloadingevent',
      CARBON_DATA_LOADED_EVENT = 'carbondataloadedevent',
      CARBON_DATA_LOAD_ERROR_EVENT = 'carbondataloaderror';

let CarbonStore = assign({},PrototypeStore,{
  initReaderStrategy(bizChartType){
    this.readerStrategy = ChartReaderStrategyFactor.getStrategyByBizChartType(bizChartType);
  },
  getLoadingStatus(){
    return _isLoading;
  },
  setDestination(dest){
    _destination = dest;
  },
  getDestination(dest){
    return _destination;
  },
  getCarbonData(){
    return _carbonData;
  },
  clearCarbonData(){
    _carbonData = null;
  },
  getCarbonRawData(){
    return _carbonRawData;
  },
  getSubmitParams(){
    return _submitParams;
  },
  getParamsObj(){
    return _paramsObj;
  },
  getCommOpions(){
    return _commOptions;
  },
  getChartTitle(){
    return _chartTitle;
  },
  getRelativeDate(){
    return _relativeDate;
  },
  getErrorMessage(){
    return _errorMessage;
  },
  getErrorCode(){
    return _errorCode;
  },
  _initErrorText(errorText){
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
  },

  _onDataLoading(params, commOptions, relativeDate){
    _submitParams = params;
    _isLoading = true;

    _commOptions = commOptions;

    if(relativeDate !== false){
      _relativeDate = relativeDate;
    }

    _paramsObj = {commIds: params.commIds,
               startTime: params.viewOption.TimeRanges[0].StartTime,
               endTime: params.viewOption.TimeRanges[0].EndTime,
               step: params.viewOption.Step,
               timeRanges: params.viewOption.TimeRanges};
  },
  _onDataChanged(data, params){
    _isLoading = false;
    _carbonRawData = data;

    let obj = {start: params.viewOption.TimeRanges[0].StartTime,
               end: params.viewOption.TimeRanges[0].EndTime,
               step: params.viewOption.Step,
               timeRanges: params.viewOption.TimeRanges};

    //add this for test team start
    window.testObj = window.testObj || {};
    window.testObj._carbonRawData = _carbonRawData;
    //add this for test team end

    _carbonData = Immutable.fromJS(this.readerStrategy.convertFn(data, obj, this));
  },
  removeSeriesDataByUid(uid){

  },
  //listners--------------------------------
  addCarbonDataLoadingListener: function(callback) {
    this.on(CARBON_DATA_LOADING_EVENT, callback);
  },
  emitCarbonDataLoading: function() {
    this.emit(CARBON_DATA_LOADING_EVENT);
  },
  removeCarbonDataLoadingListener: function(callback) {
    this.removeListener(CARBON_DATA_LOADING_EVENT, callback);
  },
  addCarbonDataLoadedListener: function(callback) {
    this.on(CARBON_DATA_LOADED_EVENT, callback);
  },
  emitCarbonDataLoadedListener: function() {
    this.emit(CARBON_DATA_LOADED_EVENT);
  },
  removeCarbonDataLoadedListener: function(callback) {
    this.removeListener(CARBON_DATA_LOADED_EVENT, callback);
  },
  addCarbonDataLoadErrorListener:function(callback) {
    this.on(CARBON_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitCarbonDataLoadErrorListener:function(callback) {
    this.emit(CARBON_DATA_LOAD_ERROR_EVENT);
  },
  removeCarbonDataLoadErrorListener: function(callback) {
    this.removeListener(CARBON_DATA_LOAD_ERROR_EVENT, callback);
  }
});


CarbonStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case ActionTypes.GET_CARBON_DATA_LOADING:
        CarbonStore._onDataLoading(action.submitParams, action.commOptions, action.relativeDate);
        CarbonStore.emitCarbonDataLoading();
        break;
      case ActionTypes.GET_CARBON_DATA_SUCCESS:
        CarbonStore._onDataChanged(action.carbonData, action.submitParams);
        CarbonStore.emitCarbonDataLoadedListener();
        break;
      case ActionTypes.GET_CARBON_DATA_ERROR:
        CarbonStore._onDataChanged(null, action.submitParams);
        CarbonStore._initErrorText(action.errorText);
        CarbonStore.emitCarbonDataLoadErrorListener();
        break;
    }
});
module.exports = CarbonStore;
