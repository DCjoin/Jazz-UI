'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import Labeling from '../constants/actionType/Labeling.jsx';
import { Action } from '../constants/actionType/Benchmark.jsx';


var _industryData = Immutable.fromJS([]);
var _zoneData = Immutable.fromJS([]);
var _benchmarkData = Immutable.fromJS([]);
var _selecteBenchmarkIndex = null;
var _selecteBenchmark = null;
var INDUSTRY_DATA_CHANGE_EVENT = 'industrydatachange';
var ZONE_DATA_CHANGE_EVENT = 'zonedatachange';
var BENCHMARK_DATA_CHANGE_EVENT = 'benchmarkdatachange';
let SELECTED_BENCHMARK_CHANGE_EVENT = 'selectedbenchmarkchange';

var BenchmarkStore = assign({}, PrototypeStore, {
  getBenchmarkData() {
    return _benchmarkData;
  },
  setBenchmarkData(benchmarkData) {
    _benchmarkData = Immutable.fromJS(benchmarkData);
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
    return _selecteBenchmark;
  },
  getSelectedBenchmarkIndex() {
    return _selecteBenchmarkIndex;
  },
  setSelectedBenchmark(benchmark) {
    _selecteBenchmark = Immutable.fromJS(benchmark);
  },
  setSelectedCalendarIndex(index) {
    _selecteBenchmarkIndex = index;
    _selecteBenchmark = _benchmarkData.get(_selecteBenchmarkIndex);
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
  addSelectedBenchmarkDataChangeListener: function(callback) {
    this.on(SELECTED_BENCHMARK_CHANGE_EVENT, callback);
  },
  emitSelectedBenchmarkDataChange: function() {
    this.emit(SELECTED_BENCHMARK_CHANGE_EVENT);
  },
  removeSelectedBenchmarkDataChangeListener: function(callback) {
    this.removeListener(SELECTED_BENCHMARK_CHANGE_EVENT, callback);
  }
});

var LabelAction = Labeling.Action;
BenchmarkStore.jsx.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case LabelAction.GET_ALL_INDUSTRIES_SUCCESS:
      BenchmarkStore.setIndustryData(action.industryData);
      BenchmarkStore.emitIndustryDataChange();
      break;
    case LabelAction.GET_ALL_ZONES_SUCCESS:
      BenchmarkStore.setZoneData(action.zoneData);
      BenchmarkStore.emitZoneDataChange();
      break;
    case LabelAction.GET_BENCHMARK_DATA_SUCCESS:
      BenchmarkStore.setBenchmarkData(action.benchmarkData);
      BenchmarkStore.emitBenchmarkDataChange();
      break;
  }
});

module.exports = BenchmarkStore;
