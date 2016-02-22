import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, Map } from 'immutable';
import VEE from '../constants/actionType/VEE.jsx';

function emptyList() {
  return new List();
}
// function emptyMap() {
//   return new Map();
// }

let _rules = emptyList(),
  _selectedId = null;

let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange';

var VEEStore = assign({}, PrototypeStore, {
  setRules: function(rules) {
    _rules = Immutable.fromJS(rules);
  },
  getRules: function() {
    return _rules
  },
  setSelectedId: function(id) {
    _selectedId = id;
  },
  getRuleById: function(id) {
    return (
    _rules.find(item => item.get("Id") === id)
    )
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange(args) {
    this.emit(CHANGE_EVENT, args);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },

  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },

  emitErrorhange(args) {
    this.emit(ERROR_CHANGE_EVENT, args);
  },
});
var VEEAction = VEE.Action;

VEEStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case VEEAction.GET_VEE_RULES:
      var pre = _rules;
      VEEStore.setRules(action.rules);
      if (pre.size === 0) {
        VEEStore.setSelectedId(_rules.getIn([0, "Id"]));
        VEEStore.emitChange(_rules.getIn([0, "Id"]));
      } else {
        VEEStore.setSelectedId(_selectedId);
        VEEStore.emitChange(_selectedId);
      }
      break;
    case VEEAction.SET_SELECTED_RULE_ID:
      VEEStore.setSelectedId(action.id);
      break;
  }
});
