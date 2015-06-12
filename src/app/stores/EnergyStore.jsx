'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Alarm.jsx';
import ReaderFuncs from './MixedChartReader.jsx';

const TAG_DATA_LOADING_EVENT = 'tagdataloading',
      TAG_DATA_CHANGED_EVENT = 'tagdatachanged';

let _isLoading = false,
    _energyData = null,
    _energyRawData = null,
    _submitParams = null,
    _paramsObj = null,
    _tagOptions = null,
    _ChartTitle = null;

var EnergyStore = assign({},PrototypeStore,{
  getLoadingStatus(){
    return _isLoading;
  },
  getEnergyData(){
    return _energyData;
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
    return _ChartTitle;
  },
  //only one tagOptions if click tag in alarm list
  _onDataLoading(params, tagOptions){
    _submitParams = params;
    _isLoading = true;

    if(tagOptions){
      _tagOptions = tagOptions;
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
      _ChartTitle = tagName + uom + '能耗报警';
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


    _energyData = ReaderFuncs.convert(data, obj);
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
});

EnergyStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_TAG_DATA_LOADING:
        EnergyStore._onDataLoading(action.submitParams, action.tagOptions);
        EnergyStore.emitTagDataLoading();
        break;
      case Action.GET_TAG_DATA_SUCCESS:
        EnergyStore._onDataChanged(action.energyData, action.submitParams);
        EnergyStore.emitTagDataChange();
        break;
      case Action.GET_TAG_DATA_ERROR:
        EnergyStore._onDataChanged(null, action.submitParams);
        EnergyStore.emitTagDataChange();
        break;
    }
});

module.exports = EnergyStore;
