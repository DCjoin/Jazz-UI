'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Energy.jsx';
import ReaderFuncs from './MixedChartReader.jsx';
import CommonFuns from '../util/Util.jsx';
import ChartStatusStore from './energy/ChartStatusStore.jsx'

const RATIO_DATA_LOADING_EVENT = 'ratiodataloadingevent',
      RATIO_DATA_LOADED_EVENT = 'ratiodataloadedevent',
      RATIO_DATA_LOAD_ERROR_EVENT = 'ratiodataloaderror';


let _isLoading = false,
    _energyData = null,
    _energyRawData = null,
    _submitParams = null,
    _paramsObj = null,
    _tagOptions = null,
    _chartTitle = null,
    _relativeDate = null,
    _errorCode = null,
    _errorMessage = null;

var RatioStore = assign({},PrototypeStore,{
  getLoadingStatus(){
    return _isLoading;
  },
  getEnergyData(){
    return _energyData;
  },
  clearEnergyDate(){
    _energyData = null;
  },
  getEnergyRawData(){
    return _energyRawData;
  },
  getSubmitParams(){
    return _submitParams;
  },
  getParamsObj(){
    return _paramsObj;
  },
  getRatioOpions(){
    return _tagOptions;
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
  //only one tagOptions if click tag in alarm list
  _onDataLoading(params, tagOptions, relativeDate, isAlarmLoading){
    _submitParams = params;
    _isLoading = true;

    _tagOptions = tagOptions;

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
    _energyRawData = data;

    let obj = {start: params.viewOption.TimeRanges[0].StartTime,
               end: params.viewOption.TimeRanges[0].EndTime,
               step: params.viewOption.Step,
               timeRanges: params.viewOption.TimeRanges};

    //add this for test team start
    window.testObj = window.testObj || {};
    window.testObj._energyRawData = _energyRawData;
    //add this for test team end

    ChartStatusStore.onEnergyDataLoaded(data, _submitParams);
    _energyData = Immutable.fromJS(ReaderFuncs.convert(data, obj));
  },
  /*
    returns boolean: if only one tag left, then reload data.
  */
  removeSeriesDataByUid(uid){
    if(_energyData){
      let latestDataList = [];
      let dataList = _energyData.toJS().Data;

      for(let i=0,len=dataList.length; i<len; i++){
        let data = dataList[i];
        if(data.uid !== uid){
          latestDataList.push(data);
        }
      }
      if(latestDataList.length === 1){
        return true;
      }else if(latestDataList.length > 0){
        _energyData = _energyData.set('Data', latestDataList);
      }else{
        _energyData = null;
      }
    }
    return false;
  },
  addRatioDataLoadingListener: function(callback) {
    this.on(RATIO_DATA_LOADING_EVENT, callback);
  },
  emitRatioDataLoading: function() {
    this.emit(RATIO_DATA_LOADING_EVENT);
  },
  removeRatioDataLoadingListener: function(callback) {
    this.removeListener(RATIO_DATA_LOADING_EVENT, callback);
  },
  addRatioDataLoadedListener: function(callback) {
    this.on(RATIO_DATA_LOADED_EVENT, callback);
  },
  emitRatioDataLoadedListener: function() {
    this.emit(RATIO_DATA_LOADED_EVENT);
  },
  removeRatioDataLoadedListener: function(callback) {
    this.removeListener(RATIO_DATA_LOADED_EVENT, callback);
  },
  addRatioDataLoadErrorListener:function(callback) {
    this.on(RATIO_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitRatioDataLoadErrorListener:function(callback) {
    this.emit(RATIO_DATA_LOAD_ERROR_EVENT);
  },
  removeRatioDataLoadErrorListener: function(callback) {
    this.removeListener(RATIO_DATA_LOAD_ERROR_EVENT, callback);
  }
});


RatioStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_RATIO_DATA_LOADING:
        RatioStore._onDataLoading(action.submitParams, action.tagOptions, action.relativeDate, false);
        RatioStore.emitRatioDataLoading();
        break;
      case Action.GET_RATIO_DATA_SUCCESS:
        RatioStore._onDataChanged(action.energyData, action.submitParams);
        RatioStore.emitRatioDataLoadedListener();
        break;
      case Action.GET_RATIO_DATA_ERROR:
        RatioStore._onDataChanged(null, action.submitParams);
        RatioStore._initErrorText(action.errorText);
        RatioStore.emitRatioDataLoadErrorListener();
        break;
    }
});

module.exports = RatioStore;
