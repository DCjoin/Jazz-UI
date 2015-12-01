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
};

module.exports = PlatformAction;
