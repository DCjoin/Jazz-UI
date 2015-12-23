'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Alarm.jsx';

let _errorMessage = '';
let _errorCode = '';
let _dialogShow = false;
let CLEAR_GLOBAL_ERROR_MESSAGE = 'clearglobalerror';
var GlobalErrorMessageStore = assign({}, PrototypeStore, {
  getErrorMessage() {
    return _errorMessage;
  },
  setErrorMessage(msg) {
    _errorMessage = msg;
  },
  getErrorCode() {
    return _errorCode;
  },
  setErrorCode(code) {
    if (typeof code == 'number')
      code = code + '';
    _errorCode = code;
  },
  setDialogShow(dialogShow) {
    _dialogShow = dialogShow;
  },
  getDialogShow(dialogShow) {
    return _dialogShow;
  },
  ClearGlobalError: function() {
    _errorMessage = '';
    _errorCode = '';
    _dialogShow = false;
  },
  emitClearGlobalErrorChange: function() {
    this.emit(CLEAR_GLOBAL_ERROR_MESSAGE);
  },
  addClearGlobalErrorListener: function(callback) {
    this.on(CLEAR_GLOBAL_ERROR_MESSAGE, callback);
  },
  removeClearGlobalErrorListener: function(callback) {
    this.removeListener(CLEAR_GLOBAL_ERROR_MESSAGE, callback);
    this.dispose();
  },
});
GlobalErrorMessageStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GLOBAL_ERROR_MESSAGE_CHANGED:
      GlobalErrorMessageStore.setErrorMessage(action.errorMessage);
      GlobalErrorMessageStore.setErrorCode(action.errorCode);
      GlobalErrorMessageStore.setDialogShow(action.dialogShow);
      GlobalErrorMessageStore.emitChange();
      break;
    case Action.CLEAR_GLOBAL_ERROR_MESSAGE:
      GlobalErrorMessageStore.ClearGlobalError();
      GlobalErrorMessageStore.emitClearGlobalErrorChange();
      break;
  }
});

module.exports = GlobalErrorMessageStore;
