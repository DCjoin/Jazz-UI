'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
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
  _errorMessage = null;

const ENERGY_DATA_LOADING_EVENT = 'energydataloadingevent',
  ENERGY_DATA_LOADED_EVENT = 'energydataloadedevent',
  ENERGY_DATA_LOAD_ERROR_EVENT = 'energydataloaderror';

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
  getErrorCode() {
    return _errorCode;
  },
  _initErrorText(errorText) {
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
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

    _energyData = Immutable.fromJS(this.readerStrategy.convertFn(data, obj, this));
  },
  removeSeriesDataByUid(uid) {},
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
      break;
    case Action.GET_ENERGY_DATA_ERROR:
      EnergyStore._onDataChanged(null, action.submitParams);
      EnergyStore._initErrorText(action.errorText);
      EnergyStore.emitEnergyDataLoadErrorListener();
      break;
  }
});
module.exports = EnergyStore;
