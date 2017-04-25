'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Benchmark.jsx';
import Ajax from '../ajax/Ajax.jsx';
let BenchmarkAction = {
  getAllIndustries() {
    Ajax.post('/Administration/GetAllIndustries', {
      params: {
        includeRoot: true,
        onlyLeaf: false,
        sysId:1
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
    Ajax.post('/Administration/GetAllZones', {
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
    Ajax.post('/Administration/GetAllBenchmarks', {
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
    Ajax.post('/Administration/ModifyBenchmark', {
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
    Ajax.post('/Administration/CreateBenchmark', {
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
    Ajax.post('/Administration/DeleteBenchmark', {
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
