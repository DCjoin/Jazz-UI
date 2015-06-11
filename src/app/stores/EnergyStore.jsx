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
    _hierName = null,
    _tagOptions = null;

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
  getHierName(){
    return _hierName;
  },
  getTagOpions(){
    return _tagOptions;
  },
  _onDataLoading(params, hierName, tagOptions){
    _submitParams = params;
    _isLoading = true;
    _hierName = hierName;

    if(tagOptions){
      _tagOptions = tagOptions;
    }

    _paramsObj = {startTime: params.viewOption.TimeRanges[0].StartTime,
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
        EnergyStore._onDataLoading(action.submitParams, action.hierName, action.tagOptions);
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
