/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import events from 'events';
import assign from 'object-assign';
import ResetPasswordActionType from '../constants/actionType/ResetPassword.jsx';

let { EventEmitter } = events;

let CHANGE_EVENT = 'change';

let _restPSW = null;

let ResetPasswordStore = assign({}, EventEmitter.prototype, {
  resetPSW:function(data, success){
    if(success){
      _restPSW = true;
    }else {
      _restPSW = false;
    }
    return _restPSW;
  },
  getResetPSW: function(argument) {
    return _restPSW;
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange: function(arg) {
    this.emit(arg || CHANGE_EVENT);
  },
});

ResetPasswordStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case ResetPasswordActionType.Action.RESET_PASSWORD_SUCCESS:
      ResetPasswordStore.resetPSW(action.data, true);
      ResetPasswordStore.emitChange();
      break;
    case ResetPasswordActionType.Action.RESET_PASSWORD_ERROR:
      ResetPasswordStore.resetPSW(action.data, false);
      ResetPasswordStore.emitChange();
      break;
    default:
      // do nothing
  }
});

module.exports = ResetPasswordStore;
