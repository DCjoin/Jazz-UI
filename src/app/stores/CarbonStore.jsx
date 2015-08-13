'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import ReaderFuncs from './MixedChartReader.jsx';
import CommonFuns from '../util/Util.jsx';

const CARBON_DATA_LOADING_EVENT = 'carbondataloading',
      CARBON_DATA_CHANGED_EVENT = 'carbondatachanged',
      GET_DATA_ERROR_EVENT = 'getcarbondataerror';

let _isLoading = false,
    _carbonData = null,
    _submitParams = null,
    _paramsObj = null,
    _commOptions = null,
    _chartTitle = null,
    _relativeDate = null,
    _errorCode = null,
    _errorMessage = null;

var CarbonStore = assign({},PrototypeStore,{
  getLoadingStatus(){
    return _isLoading;
  },
  getCarbonData(){
    return _carbonData;
  },
  clearCarbonData(){
    _carbonData = null;
  },
  getSubmitParams(){
    return _submitParams;
  },
  getParamsObj(){
    return _paramsObj;
  },
  getCommodityOpions(){
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

    _paramsObj = {tagIds: params.tagIds,
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

    _carbonData = Immutable.fromJS(ReaderFuncs.convert(data, obj));
  },
  /*
    returns boolean: if only one tag left, then reload data.
  */
  removeSeriesDataByUid(uid){
    if(_carbonData){
      let latestDataList = [];
      let dataList = _carbonData.toJS().Data;

      for(let i=0,len=dataList.length; i<len; i++){
        let data = dataList[i];
        if(data.uid !== uid){
          latestDataList.push(data);
        }
      }
      if(latestDataList.length === 1){
        return true;
      }else if(latestDataList.length > 0){
        _carbonData = _carbonData.set('Data', latestDataList);
      }else{
        _carbonData = null;
      }
    }
    return false;
  },
  addCarbonDataLoadingListener: function(callback) {
    this.on(CARBON_DATA_LOADING_EVENT, callback);
  },
  emitCarbonDataLoading: function() {
    this.emit(CARBON_DATA_LOADING_EVENT);
  },
  removeCarbonDataLoadingListener: function(callback) {
    this.removeListener(CARBON_DATA_LOADING_EVENT, callback);
  },
  addCarbonDataChangeListener: function(callback) {
    this.on(CARBON_DATA_CHANGED_EVENT, callback);
  },
  emitCarbonDataChange: function() {
    this.emit(CARBON_DATA_CHANGED_EVENT);
  },
  removeCarbonDataChangeListener: function(callback) {
    this.removeListener(CARBON_DATA_CHANGED_EVENT, callback);
  },
  addGetCarbonDataErrorListener:function(callback) {
    this.on(GET_DATA_ERROR_EVENT, callback);
  },
  emitGetCarbonDataErrorListener:function(callback) {
    this.emit(GET_DATA_ERROR_EVENT);
  },
  removeGetCarbonDataErrorListener: function(callback) {
    this.removeListener(GET_DATA_ERROR_EVENT, callback);
  }
});

CarbonStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_CARBON_DATA_LOADING:
        CarbonStore._onDataLoading(action.submitParams, action.commOptions, action.relativeDate, false);
        CarbonStore.emitCarbonDataLoading();
        break;
      case Action.GET_CARBON_DATA_SUCCESS:
        CarbonStore._onDataChanged(action.carbonData, action.submitParams);
        CarbonStore.emitCarbonDataChange();
        break;
      case Action.GET_CARBON_DATA_ERROR:
        CarbonStore._onDataChanged(null, action.submitParams);
        CarbonStore._initErrorText(action.errorText);
        CarbonStore.emitGetCarbonDataErrorListener();
        break;
    }
});

module.exports = CarbonStore;
