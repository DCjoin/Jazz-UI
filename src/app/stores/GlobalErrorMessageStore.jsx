'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Alarm.jsx';

let _errorMessage = '';
let _errorCode = '';
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
    _errorCode = code;
  }
});
GlobalErrorMessageStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GLOBAL_ERROR_MESSAGE_CHANGED:
      GlobalErrorMessageStore.setErrorMessage(action.errorMessage);
      GlobalErrorMessageStore.setErrorCode(action.errorCode);
      GlobalErrorMessageStore.emitChange();
      break;
  }
});

module.exports = GlobalErrorMessageStore;
