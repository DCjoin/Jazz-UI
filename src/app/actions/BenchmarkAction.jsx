'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Benchmark.jsx';
import Ajax from '../ajax/ajax.jsx';
let BenchmarkAction = {
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
    Ajax.post('/Administration.svc/ModifyBenchmark', {
      params: {
        dto: data
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_BENCHMARK_SUCCESS,
          calendar: calendar
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  createBenchmark(data, type) {
    var me = this;
    Ajax.post('/Administration.svc/CreateBenchmark', {
      params: {
        dto: data
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.CREATE_BENCHMARK_SUCCESS,
          calendar: calendar
        });
        me.getCalendarListByType(type);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  deleteBenchmarkById(id, version) {
    Ajax.post('/Administration.svc/DeleteBenchmark', {
      params: {
        dto: {
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
      }
    });
  }
};
module.exports = BenchmarkAction;
