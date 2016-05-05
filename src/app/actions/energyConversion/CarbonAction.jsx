'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/energyConversion/Carbon.jsx';
import Ajax from '../../ajax/ajax.jsx';
import Immutable from 'immutable';
let CarbonAction = {
  GetAllCarbonFactor: function() {
    Ajax.post('/Administration.svc/GetAllCarbonFactor', {
      success: function(carbons) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_CARBON_FACTOR,
          carbons: carbons
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  GetConversionPairs: function() {
    var that = this;
    Ajax.post('/Administration.svc/GetConversionPairs', {
      success: function(conversionPairs) {
        that.GetAllCarbonFactor();
        AppDispatcher.dispatch({
          type: Action.GET_CONVERSION_PAIRS,
          conversionPairs: conversionPairs
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  SaveCarbonFactor: function(carbonData) {
    var that = this;
    Ajax.post('/Administration.svc/SaveCarbonFactor', {
      params: {
        dto: carbonData
      },
      success: function(carbon) {
        AppDispatcher.dispatch({
          type: Action.SAVE_FACTOR_SUCCESS,
          id: carbon.Id
        });
        that.GetAllCarbonFactor();

      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  deleteCarbon: function(carbonData) {
    var that = this;
    Ajax.post('/Administration.svc/DeleteCarbonFactor', {
      params: {
        dto: {
          Id: carbonData.Id,
          Version: carbonData.Version
        }
      },
      success: function(carbon) {
        AppDispatcher.dispatch({
          type: Action.DELETE_FACTOR_SUCCESS,
          id: carbonData.Id
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setCurrentSelectedId: function(id) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_ID,
      id: id
    });
  },
  ClearAll: function() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_ALL,
    });
  },
  merge: function(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_CARBON,
      data: data
    });
  },
  addFactor: function() {
    AppDispatcher.dispatch({
      type: Action.ADD_FACTOR
    });
  },
  deleteFactor: function(index) {
    AppDispatcher.dispatch({
      type: Action.DELETE_FACTOR,
      index: index,
    });
  },
  reset: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_CARBON,
    });
  },
};
module.exports = CarbonAction;
