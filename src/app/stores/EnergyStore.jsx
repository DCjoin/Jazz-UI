'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Alarm.jsx';
import ReaderFuncs from './MixedChartReader.jsx';
import CommonFuns from '../util/Util.jsx';

const TAG_DATA_LOADING_EVENT = 'tagdataloading',
      TAG_DATA_CHANGED_EVENT = 'tagdatachanged',
      GET_DATA_ERROR_EVENT = 'gettagdataerror';

let _isLoading = false,
    _isAlarmLoading = false,
    _energyData = null,
    _energyRawData = null,
    _submitParams = null,
    _paramsObj = null,
    _tagOptions = null,
    _chartTitle = null,
    _relativeDate = null,
    _errorCode = null,
    _errorMessage = null;

var EnergyStore = assign({},PrototypeStore,{
  getLoadingStatus(){
    return _isLoading;
  },
  getAlarmLoadingStatus(){
    return _isAlarmLoading;
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
  getTagOpions(){
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
    _isAlarmLoading = false;

    _tagOptions = tagOptions;

    if(relativeDate !== false){
      _relativeDate = relativeDate;
    }

    if(isAlarmLoading){
      _isAlarmLoading = true;
      let tagName = _tagOptions[0].tagName;
      let step = _submitParams.viewOption.Step;

      var uom='';
      if(step ==1) {
        uom = '小时';
      }else if(step ==2){
        uom = '日';
      }else if(step == 3){
        uom = '月';
      }
      _chartTitle = tagName + uom + '能耗报警';
    }

    _paramsObj = {tagIds: params.tagIds,
               startTime: params.viewOption.TimeRanges[0].StartTime,
               endTime: params.viewOption.TimeRanges[0].EndTime,
               step: params.viewOption.Step,
               timeRanges: params.viewOption.TimeRanges};
  },
  _onDataChanged(data, params){
    _isLoading = false;
    _isAlarmLoading = false;
    _energyRawData = data;

    let obj = {start: params.viewOption.TimeRanges[0].StartTime,
               end: params.viewOption.TimeRanges[0].EndTime,
               step: params.viewOption.Step,
               timeRanges: params.viewOption.TimeRanges};


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
  addTagDataLoadingListener: function(callback) {
    this.on(TAG_DATA_LOADING_EVENT, callback);
  },
  emitTagDataLoading: function() {
    this.emit(TAG_DATA_LOADING_EVENT);
  },
  removeTagDataLoadingListener: function(callback) {
    this.removeListener(TAG_DATA_LOADING_EVENT, callback);
  },
  addTagDataChangeListener: function(callback) {
    this.on(TAG_DATA_CHANGED_EVENT, callback);
  },
  emitTagDataChange: function() {
    this.emit(TAG_DATA_CHANGED_EVENT);
  },
  removeTagDataChangeListener: function(callback) {
    this.removeListener(TAG_DATA_CHANGED_EVENT, callback);
  },
  addGetTagDataErrorListener:function(callback) {
    this.on(GET_DATA_ERROR_EVENT, callback);
  },
  emitGetTagDataErrorListener:function(callback) {
    this.emit(GET_DATA_ERROR_EVENT);
  },
  removeGetTagDataErrorListener: function(callback) {
    this.removeListener(GET_DATA_ERROR_EVENT, callback);
  }
});

EnergyStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_ALARM_TAG_DATA_LOADING:
      EnergyStore._onDataLoading(action.submitParams, action.tagOptions, null, true);
      EnergyStore.emitTagDataLoading();
        break;
      case Action.GET_TAG_DATA_LOADING:
        EnergyStore._onDataLoading(action.submitParams, action.tagOptions, action.relativeDate, false);
        EnergyStore.emitTagDataLoading();
        break;
      case Action.GET_TAG_DATA_SUCCESS:
        EnergyStore._onDataChanged(action.energyData, action.submitParams);
        EnergyStore.emitTagDataChange();
        break;
      case Action.GET_TAG_DATA_ERROR:
        EnergyStore._onDataChanged(null, action.submitParams);
        EnergyStore._initErrorText(action.errorText);
        EnergyStore.emitGetTagDataErrorListener();
        break;
    }
});

module.exports = EnergyStore;
