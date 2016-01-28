'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from './../util/Util.jsx';
import ActionTypes from './../constants/actionType/Carbon.jsx';
import ChartReaderStrategyFactor from './energy/ChartReaderStrategyFactor.jsx';
import ChartStatusStore from './energy/ChartStatusStore.jsx';

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
  _destination = 2,
  _errorCodes = [],
  _errorParams = [];


const CARBON_DATA_LOADING_EVENT = 'carbondataloadingevent',
  CARBON_DATA_LOADED_EVENT = 'carbondataloadedevent',
  CARBON_DATA_LOAD_ERROR_EVENT = 'carbondataloaderror',
  CARBON_DATA_LOAD_ERRORS_EVENT = 'costdataloaderrors';

let CarbonStore = assign({}, PrototypeStore, {
  initReaderStrategy(bizChartType) {
    this.readerStrategy = ChartReaderStrategyFactor.getStrategyByBizChartType(bizChartType);
  },
  getLoadingStatus() {
    return _isLoading;
  },
  setDestination(dest) {
    _destination = dest;
  },
  getDestination(dest) {
    return _destination;
  },
  getCarbonData() {
    return _carbonData;
  },
  clearCarbonData() {
    _carbonData = null;
  },
  getCarbonRawData() {
    return _carbonRawData;
  },
  getSubmitParams() {
    return _submitParams;
  },
  getParamsObj() {
    return _paramsObj;
  },
  getCommOpions() {
    return _commOptions;
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
  clearCarbonStore() {
    _isLoading = false;
    _carbonData = null;
    _carbonRawData = null;
    _submitParams = null;
    _paramsObj = null;
    _commOptions = null;
    _chartTitle = null;
    _relativeDate = null;
    _errorCode = null;
    _errorMessage = null;
    _destination = 2;
    _errorCodes = [];
    _errorParams = [];
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
    }
  },
  _onDataLoading(params, commOptions, relativeDate) {
    _submitParams = params;
    _isLoading = true;

    _commOptions = commOptions;

    if (relativeDate !== false) {
      _relativeDate = relativeDate;
    }
    _paramsObj = {
      hierId: params.hierarchyId,
      commIds: params.commodityIds,
      startTime: params.viewOption.TimeRanges[0].StartTime,
      endTime: params.viewOption.TimeRanges[0].EndTime,
      step: params.viewOption.Step,
      timeRanges: params.viewOption.TimeRanges
    };
  },
  _onDataChanged(data, params) {
    _isLoading = false;
    _carbonRawData = data;

    let obj = {
      start: params.viewOption.TimeRanges[0].StartTime,
      end: params.viewOption.TimeRanges[0].EndTime,
      step: params.viewOption.Step,
      timeRanges: params.viewOption.TimeRanges
    };

    //add this for test team start
    window.testObj = window.testObj || {};
    window.testObj._carbonRawData = _carbonRawData;
    //add this for test team end

    ChartStatusStore.onEnergyDataLoaded(data, _submitParams);
    _carbonData = Immutable.fromJS(this.readerStrategy.convertFn(data, obj, this));
  },
  _onChangeTimeRange(startTime, endTime) {
    let timeRanges = CommonFuns.getTimeRangesByDate(startTime, endTime);
    _paramsObj.timeRanges = timeRanges;
    _paramsObj.startTime = startTime;
    _paramsObj.endTime = endTime;
    _submitParams.viewOption.TimeRanges = timeRanges;
    _relativeDate = 'Customerize';
  },
  removeSeriesDataByUid(uid) {
    if (_carbonData) {
      let latestDataList = [];
      let dataList = _carbonData.toJS().Data;

      for (let i = 0, len = dataList.length; i < len; i++) {
        let data = dataList[i];
        if (data.uid !== uid) {
          latestDataList.push(data);
        }
      }
      if (latestDataList.length === 1) {
        return true;
      } else if (latestDataList.length > 0) {
        _carbonData = _carbonData.set('Data', latestDataList);
      } else {
        _carbonData = null;
      }
    }
    return false;
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
  addCarbonDataLoadErrorListener: function(callback) {
    this.on(CARBON_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitCarbonDataLoadErrorListener: function(callback) {
    this.emit(CARBON_DATA_LOAD_ERROR_EVENT);
  },
  removeCarbonDataLoadErrorListener: function(callback) {
    this.removeListener(CARBON_DATA_LOAD_ERROR_EVENT, callback);
  },
  addCarbonDataLoadErrorsListener: function(callback) {
    this.on(CARBON_DATA_LOAD_ERRORS_EVENT, callback);
  },
  emitCarbonDataLoadErrorsListener: function(callback) {
    this.emit(CARBON_DATA_LOAD_ERRORS_EVENT);
  },
  removeCarbonDataLoadErrorsListener: function(callback) {
    this.removeListener(CARBON_DATA_LOAD_ERRORS_EVENT, callback);
  }
});


CarbonStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.GET_CARBON_DATA_LOADING:
      CarbonStore._onDataLoading(action.submitParams, action.commOptions, action.relativeDate);
      CarbonStore.emitCarbonDataLoading();
      break;
    case ActionTypes.GET_CARBON_DATA_SUCCESS:
      CarbonStore._onDataChanged(action.carbonData, action.submitParams);
      CarbonStore.emitCarbonDataLoadedListener();
      CarbonStore._checkErrors(action.energyData);
      break;
    case ActionTypes.GET_CARBON_DATA_ERROR:
      CarbonStore._onDataChanged(null, action.submitParams);
      CarbonStore._initErrorText(action.errorText);
      CarbonStore.emitCarbonDataLoadErrorListener();
      break;
    case ActionTypes.SET_CARBON_TIME_RANGE:
      CarbonStore._onChangeTimeRange(action.startTime, action.endTime);
      break;
  }
});
module.exports = CarbonStore;
