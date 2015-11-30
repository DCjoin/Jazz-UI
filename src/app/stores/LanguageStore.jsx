import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import Language from '../constants/actionType/Language.jsx';

let SWITCH_LANGUAGE_EVENT = 'switchlanguage';

var LanguageStore = assign({}, PrototypeStore, {

  switchLanguage: function() {
    var lang = window.currentLanguage;
    lang = 1 - lang;
    window.currentLanguage = lang;
  },
  emitSwitchLanguageChange: function() {
    this.emit(SWITCH_LANGUAGE_EVENT);
  },
  addSwitchLanguageListener: function(callback) {
    this.on(SWITCH_LANGUAGE_EVENT, callback);
  },

  removeSwitchLanguageListener: function(callback) {
    this.removeListener(SWITCH_LANGUAGE_EVENT, callback);
    this.dispose();
  },

});

var LanguageAction = Language.Action;

LanguageStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case LanguageAction.SWITCH_LANGUAGE:
      LanguageStore.switchLanguage();
      LanguageStore.emitSwitchLanguageChange();
      break;

  }
});

module.exports = LanguageStore;
