'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import ChartStatusStore from '../energy/ChartStatusStore.jsx';
import assign from 'object-assign';
import _ from 'lodash';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import ChartReaderStrategyFactor from './ChartReaderStrategyFactor.jsx';


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
  _errorParams = [];

const ENERGY_DATA_LOADING_EVENT = 'energydataloadingevent',
  ENERGY_DATA_LOADED_EVENT = 'energydataloadedevent',
  ENERGY_DATA_LOAD_ERROR_EVENT = 'energydataloaderror',
  ENERGY_DATA_LOAD_ERRORS_EVENT = 'energydataloaderrors';


let EnergyStore = assign({}, PrototypeStore, {
  initReaderStrategy(bizChartType) {
    this.readerStrategy = ChartReaderStrategyFactor.getStrategyByBizChartType(bizChartType);
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

    ChartStatusStore.onEnergyDataLoaded(data, _submitParams);
    _energyData = Immutable.fromJS(this.readerStrategy.convertFn(data, obj, this));
  },
  removeSeriesDataByUid(uid) {
    if (_energyData) {
      let latestDataList = [];
      let dataList = _energyData.toJS().Data;

      for (let i = 0, len = dataList.length; i < len; i++) {
        let data = dataList[i];
        if (data.uid !== uid) {
          latestDataList.push(data);
        }
      }
      if (latestDataList.length === 1) {
        return true;
      } else if (latestDataList.length > 0) {
        _energyData = _energyData.set('Data', latestDataList);
      } else {
        _energyData = null;
      }
    }
    return false;
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
  emitEnergyDataLoading: function() {
    this.emit(ENERGY_DATA_LOADING_EVENT);
  },
  removeEnergyDataLoadingListener: function(callback) {
    this.removeListener(ENERGY_DATA_LOADING_EVENT, callback);
  },
  addEnergyDataLoadedListener: function(callback) {
    this.on(ENERGY_DATA_LOADED_EVENT, callback);
  },
  emitEnergyDataLoadedListener: function() {
    this.emit(ENERGY_DATA_LOADED_EVENT);
  },
  removeEnergyDataLoadedListener: function(callback) {
    this.removeListener(ENERGY_DATA_LOADED_EVENT, callback);
  },
  addEnergyDataLoadErrorListener: function(callback) {
    this.on(ENERGY_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitEnergyDataLoadErrorListener: function(callback) {
    this.emit(ENERGY_DATA_LOAD_ERROR_EVENT);
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
      EnergyStore.emitEnergyDataLoading();
      break;
    case Action.GET_ENERGY_DATA_SUCCESS:
      EnergyStore._onDataChanged(action.energyData, action.submitParams);
      EnergyStore.emitEnergyDataLoadedListener();
      EnergyStore._checkErrors(action.energyData);
      break;
    case Action.GET_ENERGY_DATA_ERROR:
      EnergyStore._onDataChanged(null, action.submitParams);
      EnergyStore._initErrorText(action.errorText);
      EnergyStore.emitEnergyDataLoadErrorListener();
      break;
  }
});
module.exports = EnergyStore;
