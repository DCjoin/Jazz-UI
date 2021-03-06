'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Benchmark.jsx';


var _industryData = Immutable.fromJS([]);
var _zoneData = Immutable.fromJS([]);
var _benchmarkData = Immutable.fromJS([]);
var _selectedBenchmarkIndex = null;
var _selectedBenchmark = null;
var INDUSTRY_DATA_CHANGE_EVENT = 'industrydatachange';
var ZONE_DATA_CHANGE_EVENT = 'zonedatachange';
var BENCHMARK_DATA_CHANGE_EVENT = 'benchmarkdatachange';
let SELECTED_BENCHMARK_CHANGE_EVENT = 'selectedbenchmarkchange';
let ERROR_CHANGE_EVENT = 'errorchange';

var BenchmarkStore = assign({}, PrototypeStore, {
  getBenchmarkData() {
    return _benchmarkData;
  },
  setBenchmarkData(benchmarkData) {
    _benchmarkData = Immutable.fromJS(benchmarkData);
    if (_benchmarkData && _benchmarkData.size !== 0) {
      if (_selectedBenchmarkIndex === null) {
        _selectedBenchmarkIndex = 0;
        _selectedBenchmark = _benchmarkData.get(0);
      } else {
        var index = _benchmarkData.findIndex((item) => {
          if (item.get('IndustryId') === _selectedBenchmark.get('IndustryId')) {
            return true;
          }
        });
        if (index !== -1 && _selectedBenchmarkIndex !== index) {
          _selectedBenchmarkIndex = index;
        }
      }
    } else {
      _selectedBenchmarkIndex = null;
      _selectedBenchmark = null;
    }
  },
  getIndustryData() {
    return _industryData;
  },
  setIndustryData(industryData) {
    _industryData = Immutable.fromJS(industryData);
  },
  getZoneData() {
    return _zoneData;
  },
  setZoneData(zoneData) {
    _zoneData = Immutable.fromJS(zoneData);
  },
  getSelectedBenchmark() {
    return _selectedBenchmark;
  },
  getSelectedBenchmarkIndex() {
    return _selectedBenchmarkIndex;
  },
  setSelectedBenchmark(benchmark) {
    _selectedBenchmark = Immutable.fromJS(benchmark);
  },
  setSelectedBenchmarkIndex(index) {
    if (index === null) {
      _selectedBenchmarkIndex = null;
      _selectedBenchmark = null;
    } else {
      _selectedBenchmarkIndex = index;
      _selectedBenchmark = _benchmarkData.get(_selectedBenchmarkIndex);
    }
  },
  deleteBenchmark() {
    _benchmarkData = _benchmarkData.delete(_selectedBenchmarkIndex);
    var length = _benchmarkData.size;
    if (length !== 0) {
      if (_selectedBenchmarkIndex === length) {
        _selectedBenchmarkIndex = length - 1;
      }
      _selectedBenchmark = _benchmarkData.get(_selectedBenchmarkIndex);
    } else {
      _selectedBenchmarkIndex = null;
      _selectedBenchmark = null;
    }
  },
  addIndustryDataChangeListener: function(callback) {
    this.on(INDUSTRY_DATA_CHANGE_EVENT, callback);
  },
  emitIndustryDataChange: function() {
    this.emit(INDUSTRY_DATA_CHANGE_EVENT);
  },
  removeIndustryDataChangeListener: function(callback) {
    this.removeListener(INDUSTRY_DATA_CHANGE_EVENT, callback);
  },
  addZoneDataChangeListener: function(callback) {
    this.on(ZONE_DATA_CHANGE_EVENT, callback);
  },
  emitZoneDataChange: function() {
    this.emit(ZONE_DATA_CHANGE_EVENT);
  },
  removeZoneDataChangeListener: function(callback) {
    this.removeListener(ZONE_DATA_CHANGE_EVENT, callback);
  },
  addBenchmarkDataChangeListener: function(callback) {
    this.on(BENCHMARK_DATA_CHANGE_EVENT, callback);
  },
  emitBenchmarkDataChange: function() {
    this.emit(BENCHMARK_DATA_CHANGE_EVENT);
  },
  removeBenchmarkDataChangeListener: function(callback) {
    this.removeListener(BENCHMARK_DATA_CHANGE_EVENT, callback);
  },
  addSelectedBenchmarkChangeListener: function(callback) {
    this.on(SELECTED_BENCHMARK_CHANGE_EVENT, callback);
  },
  emitSelectedBenchmarkChange: function() {
    this.emit(SELECTED_BENCHMARK_CHANGE_EVENT);
  },
  removeSelectedBenchmarkChangeListener: function(callback) {
    this.removeListener(SELECTED_BENCHMARK_CHANGE_EVENT, callback);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },
  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },
  emitErrorhange() {
    this.emit(ERROR_CHANGE_EVENT);
  }
});

BenchmarkStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_ALL_INDUSTRIES_SUCCESS:
      BenchmarkStore.setIndustryData(action.industryData);
      BenchmarkStore.emitIndustryDataChange();
      break;
    case Action.GET_ALL_ZONES_SUCCESS:
      BenchmarkStore.setZoneData(action.zoneData);
      BenchmarkStore.emitZoneDataChange();
      break;
    case Action.GET_BENCHMARK_DATA_SUCCESS:
      BenchmarkStore.setBenchmarkData(action.benchmarkData);
      BenchmarkStore.emitBenchmarkDataChange();
      BenchmarkStore.emitSelectedBenchmarkChange();
      break;
    case Action.SET_SELECTED_BENCHMARK:
      BenchmarkStore.setSelectedBenchmarkIndex(action.index);
      BenchmarkStore.emitSelectedBenchmarkChange();
      break;
    case Action.CANCEL_SAVE_BENCHMARK:
      BenchmarkStore.emitSelectedBenchmarkChange();
      break;
    case Action.MODIFT_BENCHMARK_SUCCESS:
    case Action.CREATE_BENCHMARK_SUCCESS:
      BenchmarkStore.setSelectedBenchmark(action.benchmark);
      break;
    case Action.DELETE_BENCHMARK_SUCCESS:
      BenchmarkStore.deleteBenchmark();
      BenchmarkStore.emitBenchmarkDataChange();
      BenchmarkStore.emitSelectedBenchmarkChange();
      break;
    case Action.MODIFT_BENCHMARK_ERROR:
    case Action.CREATE_BENCHMARK_ERROR:
    case Action.DELETE_BENCHMARK_ERROR:
      BenchmarkStore.emitErrorhange();
      break;
  }
});

module.exports = BenchmarkStore;
