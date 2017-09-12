'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Language.jsx';
import Ajax from '../ajax/Ajax.jsx';

let timeoutHandle = null;

let LanguageAction = {
  firstLanguageNotice: function(lang) {
    Ajax.post('/common/setlanguage', {
      params: {
        language: lang
      },
      success: function(hierarchyList) {
        AppDispatcher.dispatch({
          type: Action.FIRST_LANGUAGE_NOTICE,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
};

module.exports = LanguageAction;
