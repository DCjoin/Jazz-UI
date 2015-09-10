'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Energy.jsx';
import CommonFuns from '../util/Util.jsx';

const LABEL_DATA_LOADING_EVENT = 'labeldataloading',
      LABEL_DATA_LOADED_EVENT = 'labeldatachanged',
      LABEL_DATA_LOAD_ERROR_EVENT = 'labeldataloaderror';

let _isLoading = false,
    _energyData = null,
    _energyRawData = null,
    _submitParams = null,
    _paramsObj = null,
    _tagOptions = null,
    _labelingType = null,
    _chartTitle = null,
    _errorCode = null,
    _errorMessage = null;

var LabelStore = assign({},PrototypeStore,{
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
  getTagOpions(){
    return _tagOptions;
  },
  getLabelingType(){
    return _labelingType;
  },
  getChartTitle(){
    return _chartTitle;
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
  _onDataLoading(params, tagOptions, labelingType){
    _submitParams = params;
    _isLoading = true;
    _tagOptions = tagOptions;
    _labelingType = labelingType;

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
               timeRanges: params.viewOption.TimeRanges};

    //add this for test team start
    window.testObj = window.testObj || {};
    window.testObj._energyRawData = _energyRawData;
    //add this for test team end

    _energyData = Immutable.fromJS(data);
  },
  /*
    returns boolean: if only one tag left, then reload data.
  */
  removeSeriesDataByUid(uid){

  },
  addLabelDataLoadingListener: function(callback) {
    this.on(LABEL_DATA_LOADING_EVENT, callback);
  },
  emitLabelDataLoading: function() {
    this.emit(LABEL_DATA_LOADING_EVENT);
  },
  removeLabelDataLoadingListener: function(callback) {
    this.removeListener(LABEL_DATA_LOADING_EVENT, callback);
  },
  addLabelDataLoadedListener: function(callback) {
    this.on(LABEL_DATA_LOADED_EVENT, callback);
  },
  emitLabelDataLoaded: function() {
    this.emit(LABEL_DATA_LOADED_EVENT);
  },
  removeLabelDataLoadedListener : function(callback) {
    this.removeListener(LABEL_DATA_LOADED_EVENT, callback);
  },
  addLabelDataLoadErrorListener: function(callback) {
    this.on(LABEL_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitLabelDataLoadErrorListener:function() {
    this.emit(LABEL_DATA_LOAD_ERROR_EVENT);
  },
  removeLabelDataLoadErrorListener:function(callback) {
    this.removeListener(LABEL_DATA_LOAD_ERROR_EVENT, callback);
  }
});

LabelStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_LABEL_DATA_LOADING:
        LabelStore._onDataLoading(action.submitParams, action.tagOptions, action.labelingType);
        LabelStore.emitLabelDataLoading();
        break;
      case Action.GET_LABEL_DATA_SUCCESS:
        LabelStore._onDataChanged(action.energyData, action.submitParams);
        LabelStore.emitLabelDataLoaded();
        break;
      case Action.GET_LABEL_DATA_ERROR:
        LabelStore._onDataChanged(null, action.submitParams);
        LabelStore._initErrorText(action.errorText);
        LabelStore.emitLabelDataLoadErrorListener();
        break;
    }
});

module.exports = LabelStore;
