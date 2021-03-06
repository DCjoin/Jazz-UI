'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import ChartStatusStore from '../Energy/ChartStatusStore.jsx';
import assign from 'object-assign';
import _ from 'lodash-es';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import ChartReaderStrategyFactor from './ChartReaderStrategyFactor.jsx';
import AlarmTagStore from '../AlarmTagStore.jsx';


let _isLoading = false,
  _energyData = null,
  _energyRawData = null,
  _submitParams = null,
  _paramsObj = null,
  _tagOptions = null,
  _chartTitle = null,
  _relativeDate = null,
  _errorCode = null,
  _errorMessage = null,
  _errorCodes = [],
  _errorParams = [],
  _chartType='line';

const ENERGY_DATA_LOADING_EVENT = 'energydataloadingevent',
  ENERGY_DATA_LOADED_EVENT = 'energydataloadedevent',
  ENERGY_DATA_LOAD_ERROR_EVENT = 'energydataloaderror',
  ENERGY_DATA_LOAD_ERRORS_EVENT = 'energydataloaderrors';


let EnergyStore = assign({}, PrototypeStore, {
  initReaderStrategy(bizChartType) {
    this.readerStrategy = ChartReaderStrategyFactor.getStrategyByBizChartType(bizChartType);
  },
  setChartType(type){
    _chartType=type;
  },
  getChartType(){
    return _chartType
  },
  getLoadingStatus() {
    return _isLoading;
  },
  getEnergyData() {
    return _energyData;
  },
  clearEnergyDate() {
    _energyData = null;
  },
  getEnergyRawData() {
    return _energyRawData;
  },
  getSubmitParams() {
    return _submitParams;
  },
  getParamsObj() {
    return _paramsObj;
  },
  getTagOpions() {
    return _tagOptions;
  },
  getChartTitle() {
    return _chartTitle;
  },
  getRelativeDate() {
    return _relativeDate;
  },
  getErrorMessage() {
    return _errorMessage;
  },
  getErrorParams() {
    return _errorParams;
  },
  getErrorCode() {
    return _errorCode;
  },
  getErrorCodes() {
    return _errorCodes;
  },
  getTagIdsFromTagOptions(tagOptions) {
    let tagIds = [];
    for (let i = 0, len = tagOptions.length; i < len; i++) {
      tagIds.push(tagOptions[i].tagId);
    }
    return tagIds;
  },
  clearEnergyStore() {
    _isLoading = false;
    _energyData = null;
    _energyRawData = null;
    _submitParams = null;
    _paramsObj = null;
    _tagOptions = null;
    _chartTitle = null;
    _relativeDate = null;
    _errorCode = null;
    _errorMessage = null;
    _errorCodes = [];
    _errorParams = [];
    _chartType='line';
  },
  _initErrorText(errorText) {
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
  },
  _checkErrors(data) {
    if (!data) return;
    var errors = data.Errors;
    var error, errorCode;
    _errorCodes = [];
    _errorParams = [];
    if (errors && errors.length > 0) {
      for (var i = 0, len = errors.length; i < len; i++) {
        error = errors[i];
        errorCode = CommonFuns.processErrorCode(error.ErrorCode).errorCode;
        _errorCodes.push(errorCode);
        _errorParams.push(error.Params);
      }
      this.emitEnergyDataLoadErrorsListener();
    }
  },
  _onDataLoading(params, tagOptions, relativeDate) {
    _submitParams = params;
    _isLoading = true;

    _tagOptions = _.cloneDeep(tagOptions);

    if (relativeDate !== false) {
      _relativeDate = relativeDate;
    }

    _paramsObj = {
      tagIds: params.tagIds,
      startTime: params.viewOption.TimeRanges[0].StartTime,
      endTime: params.viewOption.TimeRanges[0].EndTime,
      step: params.viewOption.Step,
      timeRanges: params.viewOption.TimeRanges
    };
  },
  _onDataChanged(data, params) {
    var currentNodeOptionsIds = this.getTagIdsFromTagOptions(AlarmTagStore.getSearchTagList());
    var paramsTagIds=params.tagIds;
    if(currentNodeOptionsIds.toString()===paramsTagIds.toString()){
      _isLoading = false;
      _energyRawData = data;

      let obj = {
        start: params.viewOption.TimeRanges[0].StartTime,
        end: params.viewOption.TimeRanges[0].EndTime,
        step: params.viewOption.Step,
        timeRanges: params.viewOption.TimeRanges
      };

      //add this for test team start
      window.testObj = window.testObj || {};
      window.testObj._energyRawData = _energyRawData;
      //add this for test team end
      if(_chartType==='scatterplot' || _chartType==='bubble'){
        ChartStatusStore.onOtherDataLoaded(data, _submitParams);
        _energyData=Immutable.fromJS(data);
        return true
      }else{
      ChartStatusStore.onEnergyDataLoaded(data, _submitParams);
      _energyData = Immutable.fromJS(this.readerStrategy.convertFn(data, obj, this));
      return true
      }
  
    }
    else {
      return false
    }

  },
  _onChangeTimeRange(startTime, endTime) {
    let timeRanges = CommonFuns.getTimeRangesByDate(startTime, endTime);
    _paramsObj.timeRanges = timeRanges;
    _paramsObj.startTime = startTime;
    _paramsObj.endTime = endTime;
    _submitParams.viewOption.TimeRanges = timeRanges;
    _relativeDate = 'Customerize';
  },
  changeMultipleTimeRanges(timeRanges) {
    _paramsObj.startTime = timeRanges[0].StartTime;
    _paramsObj.endTime = timeRanges[0].EndTime;
    _paramsObj.timeRanges = timeRanges;
    let obj = {
      start: timeRanges[0].StartTime,
      end: timeRanges[0].EndTime,
      step: _submitParams.viewOption.Step,
      timeRanges: timeRanges
    };
    for (var i = 0; i < timeRanges.length; i++) {
      var data = _energyRawData.TargetEnergyData[i];
      data.Target.TimeSpan = timeRanges[i];
    }
    _energyData = Immutable.fromJS(this.readerStrategy.convertFn(_energyRawData, obj, this));
  },

  removeSeriesDataByUid(uid) {
    if (_energyData) {
      let latestDataList = [];
      let dataList = _energyData.toJS().Data;

      for (let i = 0, len = dataList.length; i < len; i++) {
        let data = dataList[i];
        if (data.uid !== uid) {
          latestDataList.push(data);
        } else {
          this.removeMappingTimespan(i);
        }
      }
      if (latestDataList.length === 1) {
        return true;
      } else if (latestDataList.length > 0) {
        _energyData = _energyData.set('Data', latestDataList);
        return true;
      } else {
        _energyData = null;
      }
    }
    return false;
  },
  removeMappingTimespan(index) {
    if (_paramsObj && _paramsObj.timeRanges.length > 1) {
      _paramsObj.timeRanges.splice(index, 1);
    }
  },
  getMultiTimespanIndex(uid) {
    if (_submitParams && _energyData && _submitParams.viewOption.TimeRanges.length > 1) {
      let dataList = _energyData.toJS().Data;
      for (let i = 0, len = dataList.length; i < len; i++) {
        let data = dataList[i];
        if (data.uid === uid) {
          return i;
        }
      }
    }
    return -1;
  },
  //listners--------------------------------
  addEnergyDataLoadingListener: function(callback) {
    this.on(ENERGY_DATA_LOADING_EVENT, callback);
  },
  emitEnergyDataLoading: function(id) {
    this.emit(ENERGY_DATA_LOADING_EVENT, id);
  },
  removeEnergyDataLoadingListener: function(callback) {
    this.removeListener(ENERGY_DATA_LOADING_EVENT, callback);
  },
  addEnergyDataLoadedListener: function(callback) {
    this.on(ENERGY_DATA_LOADED_EVENT, callback);
  },
  emitEnergyDataLoadedListener: function(id) {
    this.emit(ENERGY_DATA_LOADED_EVENT, id);
  },
  removeEnergyDataLoadedListener: function(callback) {
    this.removeListener(ENERGY_DATA_LOADED_EVENT, callback);
  },
  addEnergyDataLoadErrorListener: function(callback) {
    this.on(ENERGY_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitEnergyDataLoadErrorListener: function(callback, id) {
    this.emit(ENERGY_DATA_LOAD_ERROR_EVENT, id);
  },
  removeEnergyDataLoadErrorListener: function(callback) {
    this.removeListener(ENERGY_DATA_LOAD_ERROR_EVENT, callback);
  },
  addEnergyDataLoadErrorsListener: function(callback) {
    this.on(ENERGY_DATA_LOAD_ERRORS_EVENT, callback);
  },
  emitEnergyDataLoadErrorsListener: function() {
    this.emit(ENERGY_DATA_LOAD_ERRORS_EVENT);
  },
  removeEnergyDataLoadErrorsListener: function(callback) {
    this.removeListener(ENERGY_DATA_LOAD_ERRORS_EVENT, callback);
  }
});


EnergyStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_ENERGY_DATA_LOADING:
      EnergyStore._onDataLoading(action.submitParams, action.tagOptions, action.relativeDate);
      EnergyStore.emitEnergyDataLoading(action.widgetId);
      break;
    case Action.GET_ENERGY_DATA_SUCCESS:
      var isCurrentEnergyData=EnergyStore._onDataChanged(action.energyData, action.submitParams);
      if(isCurrentEnergyData){
        EnergyStore.emitEnergyDataLoadedListener();
        EnergyStore._checkErrors(action.energyData);
      }
      break;
    case Action.GET_ENERGY_DATA_ERROR:
      var isCurrentEnergyData=EnergyStore._onDataChanged(null, action.submitParams);
      if(isCurrentEnergyData){
        EnergyStore._initErrorText(action.errorText);
        EnergyStore.emitEnergyDataLoadErrorListener();
      }
      break;
    case Action.SET_ENERGY_TIME_RANGE:
      EnergyStore._onChangeTimeRange(action.startTime, action.endTime);
      break;
    case Action.SET_CHART_TYPE:
      EnergyStore.setChartType(action.chartType);
      break;
  }
});
module.exports = EnergyStore;
