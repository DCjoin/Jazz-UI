'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import ActionTypes from '../constants/actionType/Carbon.jsx';
import { DataConverter } from '../util/Util.jsx';
import Ajax from '../ajax/Ajax.jsx';

let CarbonAction = {
  //for select tags from taglist and click search button.
  getPieCarbonData(hierId, commIds, destination, viewOption, relativeDate) {
    var submitParams = {
      commodityIds: commIds,
      hierarchyId: hierId,
      destination: destination,
      viewOption: viewOption
    };

    AppDispatcher.dispatch({
      type: ActionTypes.GET_CARBON_DATA_LOADING,
      submitParams: submitParams,
      commOptions: viewOption,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/AggregateCarbonUsageData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(carbonData) {
        AppDispatcher.dispatch({
          type: ActionTypes.GET_CARBON_DATA_SUCCESS,
          carbonData: carbonData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: ActionTypes.GET_CARBON_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  getCarbonTrendChartData(hierId, commIds, destination, viewOption, relativeDate) {
    var submitParams = {
      commodityIds: commIds,
      hierarchyId: hierId,
      destination: destination,
      viewOption: viewOption
    };

    AppDispatcher.dispatch({
      type: ActionTypes.GET_CARBON_DATA_LOADING,
      submitParams: submitParams,
      commOptions: viewOption,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/GetCarbonUsageData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(carbonData) {
        AppDispatcher.dispatch({
          type: ActionTypes.GET_CARBON_DATA_SUCCESS,
          carbonData: carbonData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: ActionTypes.GET_CARBON_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },

  getCarbonUsageUnitData(hierId, commIds, destination, viewOption, relativeDate, benchmarkOption) {
    var submitParams = {
      commodityIds: commIds,
      hierarchyId: hierId,
      destination: destination,
      viewOption: viewOption,
      benchmarkOption: benchmarkOption,
    };

    AppDispatcher.dispatch({
      type: ActionTypes.GET_CARBON_DATA_LOADING,
      submitParams: submitParams,
      commOptions: viewOption,
      relativeDate: relativeDate
    });

    Ajax.post('/Energy/GetCarbonUsageUnitData', {
      params: submitParams,
      commonErrorHandling: false,
      success: function(carbonData) {
        AppDispatcher.dispatch({
          type: ActionTypes.GET_CARBON_DATA_SUCCESS,
          carbonData: carbonData,
          submitParams: submitParams
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: ActionTypes.GET_CARBON_DATA_ERROR,
          errorText: res.text,
          submitParams: submitParams
        });
      }
    });
  },
  setCarbonTimeRangeByNavigator(startTime, endTime) {
    AppDispatcher.dispatch({
      type: ActionTypes.SET_CARBON_TIME_RANGE,
      startTime: startTime,
      endTime: endTime
    });
  }
};
module.exports = CarbonAction;
