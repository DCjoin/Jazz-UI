'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Alarm.jsx';

let _errorMessage = '';
var GlobalErrorMessageDialogStore = assign({},PrototypeStore,{
  getErrorMessage(){
    return _errorMessage;
  },
  setErrorMessage(msg){
    _errorMessage =  msg;
  }
});
GlobalErrorMessageDialogStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GLOBAL_ERROR_MESSAGE_CHANGED:
      GlobalErrorMessageDialogStore.setErrorMessage(action.errorMessage);
      GlobalErrorMessageDialogStore.emitChange();
      break;
  }
});

module.exports = GlobalErrorMessageDialogStore;
