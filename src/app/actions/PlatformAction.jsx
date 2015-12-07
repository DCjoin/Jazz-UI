'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Platform.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
var UserTypeName = null;
let PlatformAction = {
  getServiceProviders: function(column, type) {
    //Column:Name, StartDate,type:0：升， 1：降
    Ajax.post('/ServiceProvider.svc/GetServiceProviders', {
      params: {
        dto: {
          StatusFilter: null,
          Order: {
            Column: column,
            Type: type
          }
        }
      },
      success: function(list) {
        AppDispatcher.dispatch({
          type: Action.GET_PROVIDER,
          list: list
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  modifyServiceProvider: function(provider) {
    Ajax.post('/ServiceProvider.svc/ModifyServiceProvider', {
      params: {
        dto: provider
      },
      success: function(item) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_SUCCESS,
          provider: item
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setSelectedProvider: function(provider) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECT_PROVIDER,
      provider: provider
    });
  },
  mergeProvider: function(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_PROVIDER,
      data: data
    });
  },
  cancelSave: function() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE,
    });
  },
};

module.exports = PlatformAction;
