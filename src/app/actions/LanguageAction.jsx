'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Language.jsx';
import Ajax from '../ajax/ajax.jsx';

let timeoutHandle = null;

let LanguageAction = {
  switchLanguage: function() {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.SWITCH_LANGUAGE_LOADING
      });
    }, 0);
    Ajax.post('/common/setlanguage', {
      params: {
        language: window.currentLanguage === 0 ? 'en-us' : 'zh-cn'
      },
      success: function(hierarchyList) {
        AppDispatcher.dispatch({
          type: Action.SWITCH_LANGUAGE,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
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
