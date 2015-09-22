'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Alarm.jsx';

let GlobalErrorMessageAction = {
  fireGlobalErrorMessage(errorMessage, errorCode) {
    setTimeout(()=>{
      AppDispatcher.dispatch({
        type: Action.GLOBAL_ERROR_MESSAGE_CHANGED,
        errorMessage: errorMessage,
        errorCode: errorCode
      });},0);
  },
  ClearGlobalErrorMessage() {
    setTimeout(()=>{
      AppDispatcher.dispatch({
        type: Action.CLEAR_GLOBAL_ERROR_MESSAGE,
      });
    },0);
  },
};
module.exports = GlobalErrorMessageAction;
