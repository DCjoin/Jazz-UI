'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Alarm.jsx';

let GlobalErrorMessageAction ={
  fireGlobalErrorMessage(errorMessage){
    AppDispatcher.dispatch({
        type: Action.GLOBAL_ERROR_MESSAGE_CHANGED,
        errorMessage: errorMessage
    });
  }
};
module.exports = GlobalErrorMessageAction;
