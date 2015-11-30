'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Language.jsx';
import Ajax from '../ajax/ajax.jsx';

let timeoutHandle = null;

let LanguageAction = {
  switchLanguage: function() {
    AppDispatcher.dispatch({
      type: Action.SWITCH_LANGUAGE
    });
  },
};

module.exports = LanguageAction;
