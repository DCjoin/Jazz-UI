'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Alarm.jsx';

let GlobalErrorMessageAction = {
  fireGlobalErrorMessage(errorMessage, errorCode, dialogShow) {
    var sendDialogShow = false;
    if (dialogShow) {
      sendDialogShow = true;
    }
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.GLOBAL_ERROR_MESSAGE_CHANGED,
        errorMessage: errorMessage,
        errorCode: errorCode,
        dialogShow: sendDialogShow
      });
    }, 0);
  },
  ClearGlobalErrorMessage() {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.CLEAR_GLOBAL_ERROR_MESSAGE,
      });
    }, 0);
  },
};
module.exports = GlobalErrorMessageAction;
