'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Platform.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
var UserTypeName = null;
var _column = null,
  _type = null;
let PlatformAction = {
  getServiceProviders: function(column = _column, type = _type) {
    _column = column;
    _type = type;
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
      commonErrorHandling: false,
      success: function(item) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_SUCCESS,
          provider: item
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_ERROR,
          res: res
        });
      }
    });

  },
  createServiceProvider: function(provider) {
    var that = this;
    Ajax.post('/ServiceProvider.svc/CreateServiceProvider', {
      params: {
        dto: provider
      },
      commonErrorHandling: false,
      success: function(item) {
        AppDispatcher.dispatch({
          type: Action.CREATE_SUCCESS,
          item: item
        });
        that.getServiceProviders(_column, _type);
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_ERROR,
          res: res
        });
      }
    });
  },
  deleteServiceProvider: function(dto) {
    var that = this;
    Ajax.post('/ServiceProvider.svc/DeleteServiceProvider', {
      params: {
        dto: dto
      },
      commonErrorHandling: false,
      success: function(item) {
        AppDispatcher.dispatch({
          type: Action.DELETE_SUCCESS,
          dto: dto
        });
        that.getServiceProviders(_column, _type);
      },
      error: function(err, res) {}
    });
  },
  sendInitPassword: function(id) {
    Ajax.post('/ServiceProvider.svc/SendInitPassword', {
      params: {
        spId: id
      },
      commonErrorHandling: false,
      success: function(item) {
        AppDispatcher.dispatch({
          type: Action.SEND_EMAIL_SUCCESS,
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_ERROR,
          res: res
        });
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