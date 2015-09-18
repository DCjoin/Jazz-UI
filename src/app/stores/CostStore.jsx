'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Energy.jsx';
import CommonFuns from '../util/Util.jsx';
import ChartReaderStrategyFactor from './Energy/ChartReaderStrategyFactor.jsx';

const COST_DATA_LOADING_EVENT = 'costdataloading',
  COST_DATA_LOADED_EVENT = 'costdatachanged',
  COST_DATA_LOAD_ERROR_EVENT = 'costdataloaderror',
  COST_DATA_LOAD_ERRORS_EVENT = 'costdataloaderrors';

let _isLoading = false,
  _energyData = null,
  _energyRawData = null,
  _submitParams = null,
  _paramsObj = null,
  _selectedList = null,
  _chartTitle = null,
  _relativeDate = null,
  _errorCode = null,
  _errorMessage = null,
  _errorCodes = [],
  _errorParams = [];

var CostStore = assign({}, PrototypeStore, {
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
  getSelectedList() {
    return _selectedList;
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
  clearCostStore() {
    _isLoading = false;
    _energyData = null;
    _energyRawData = null;
    _submitParams = null;
    _paramsObj = null;
    _selectedList = null;
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
      this.emitCostDataLoadErrorsListener();
    }
  },
  //only one tagOptions if click tag in alarm list
  _onDataLoading(params, selectedList, relativeDate) {
    _submitParams = params;
    _isLoading = true;
    _selectedList = selectedList;

    if (relativeDate !== false) {
      _relativeDate = relativeDate;
    }

    _paramsObj = {
      hierarchyId: params.viewAssociation.HierarchyId,
      commodityIds: params.commodityIds,
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

    _energyData = Immutable.fromJS(this.readerStrategy.convertFn(data, obj, this));
  },
  /*
    returns boolean: if only one tag left, then reload data.
  */
  removeSeriesDataByUid(uid) {},
  addCostDataLoadingListener: function(callback) {
    this.on(COST_DATA_LOADING_EVENT, callback);
  },
  emitCostDataLoading: function() {
    this.emit(COST_DATA_LOADING_EVENT);
  },
  removeCostDataLoadingListener: function(callback) {
    this.removeListener(COST_DATA_LOADING_EVENT, callback);
  },
  addCostDataLoadedListener: function(callback) {
    this.on(COST_DATA_LOADED_EVENT, callback);
  },
  emitCostDataLoaded: function() {
    this.emit(COST_DATA_LOADED_EVENT);
  },
  removeCostDataLoadedListener: function(callback) {
    this.removeListener(COST_DATA_LOADED_EVENT, callback);
  },
  addCostDataLoadErrorListener: function(callback) {
    this.on(COST_DATA_LOAD_ERROR_EVENT, callback);
  },
  emitCostDataLoadErrorListener: function() {
    this.emit(COST_DATA_LOAD_ERROR_EVENT);
  },
  removeCostDataLoadErrorListener: function(callback) {
    this.removeListener(COST_DATA_LOAD_ERROR_EVENT, callback);
  },
  addCostDataLoadErrorsListener: function(callback) {
    this.on(COST_DATA_LOAD_ERRORS_EVENT, callback);
  },
  emitCostDataLoadErrorsListener: function() {
    this.emit(COST_DATA_LOAD_ERRORS_EVENT);
  },
  removeCostDataLoadErrorsListener: function(callback) {
    this.removeListener(COST_DATA_LOAD_ERRORS_EVENT, callback);
  }
});

CostStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_COST_DATA_LOADING:
      CostStore._onDataLoading(action.submitParams, action.selectedList, action.relativeDate);
      CostStore.emitCostDataLoading();
      break;
    case Action.GET_COST_DATA_SUCCESS:
      CostStore._onDataChanged(action.energyData, action.submitParams);
      CostStore.emitCostDataLoaded();
      CostStore._checkErrors(action.energyData);
      break;
    case Action.GET_COST_DATA_ERROR:
      CostStore._onDataChanged(null, action.submitParams);
      CostStore._initErrorText(action.errorText);
      CostStore.emitCostDataLoadErrorListener();
      break;
  }
});

module.exports = CostStore;
