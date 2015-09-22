'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Alarm.jsx';

let GlobalErrorMessageAction = {
  fireGlobalErrorMessage(errorMessage, errorCode) {
    AppDispatcher.dispatch({
      type: Action.GLOBAL_ERROR_MESSAGE_CHANGED,
      errorMessage: errorMessage,
      errorCode: errorCode
    });
  },
  ClearGlobalErrorMessage() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_GLOBAL_ERROR_MESSAGE,
    });
  },
};
module.exports = GlobalErrorMessageAction;
