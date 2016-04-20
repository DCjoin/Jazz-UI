'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Benchmark.jsx';
import Ajax from '../ajax/ajax.jsx';
let BenchmarkAction = {
  getAllIndustries() {
    Ajax.post('/Administration.svc/GetAllIndustries', {
      params: {
        includeRoot: true,
        onlyLeaf: false
      },
      success: function(industryData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_SUCCESS,
          industryData: industryData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_ERROR
        });
      }
    });
  },
  getAllZones() {
    Ajax.post('/Administration.svc/GetAllZones', {
      params: {
        includeRoot: true
      },
      success: function(zoneData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_SUCCESS,
          zoneData: zoneData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_ERROR
        });
      }
    });
  },
  getAllBenchmarks() {
    Ajax.post('/Administration.svc/GetAllBenchmarks', {
      params: {},
      success: function(benchmarkData) {
        AppDispatcher.dispatch({
          type: Action.GET_BENCHMARK_DATA_SUCCESS,
          benchmarkData: benchmarkData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_BENCHMARK_DATA_ERROR
        });
      }
    });
  },
  setSelectedBenchmarkIndex(index) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_BENCHMARK,
      index: index
    });
  },
  cancelSaveBenchmark() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_BENCHMARK
    });
  },
  modifyBenchmark(data) {
    var me = this;
    Ajax.post('/Administration.svc/ModifyBenchmark', {
      params: {
        benchmark: data
      },
      success: function(benchmark) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_BENCHMARK_SUCCESS,
          benchmark: benchmark
        });
        me.getAllBenchmarks();
      },
      error: function(err, res) {
        console.log(err, res);
        AppDispatcher.dispatch({
          type: Action.MODIFT_BENCHMARK_ERROR
        });
      }
    });
  },
  createBenchmark(data) {
    var me = this;
    Ajax.post('/Administration.svc/CreateBenchmark', {
      params: {
        benchmark: data
      },
      success: function(benchmark) {
        AppDispatcher.dispatch({
          type: Action.CREATE_BENCHMARK_SUCCESS,
          benchmark: benchmark
        });
        me.getAllBenchmarks();
      },
      error: function(err, res) {
        console.log(err, res);
        AppDispatcher.dispatch({
          type: Action.CREATE_BENCHMARK_ERROR
        });
      }
    });
  },
  deleteBenchmarkById(id, version) {
    Ajax.post('/Administration.svc/DeleteBenchmark', {
      params: {
        benchmark: {
          Id: id,
          Version: version
        }
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_BENCHMARK_SUCCESS
        });
      },
      error: function(err, res) {
        console.log(err, res);
        AppDispatcher.dispatch({
          type: Action.DELETE_BENCHMARK_ERROR
        });
      }
    });
  }
};
module.exports = BenchmarkAction;
