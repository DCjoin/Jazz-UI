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

};
module.exports = CarbonAction;
