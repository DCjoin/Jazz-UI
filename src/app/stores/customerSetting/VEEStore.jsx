import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, Map } from 'immutable';
import VEE from '../../constants/actionType/customerSetting/VEE.jsx';

function emptyList() {
  return new List();
}
// function emptyMap() {
//   return new Map();
// }

let _rules = emptyList(),
  _selectedId = null,
  _allReceivers = emptyList();

let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange',
  REVEIVERS_CHANGE_EVENT = 'receiverschange';

var VEEStore = assign({}, PrototypeStore, {
  setRules: function(rules) {
    rules.forEach(rule => {
      rule.CheckNotify = !!rule.NotifyConsecutiveHours
    });
    _rules = Immutable.fromJS(rules);
  },
  getRules: function() {
    return _rules
  },
  setSelectedId: function(id) {
    _selectedId = id;
  },
  getSelectedId: function() {
    return _selectedId;
  },
  getRuleById: function(id) {
    return (
    _rules.find(item => item.get("Id") === id)
    )
  },
  getIntervalList: function() {
    return ([
      '1' + I18N.EM.Hour,
      '2' + I18N.EM.Hour,
      '4' + I18N.EM.Hour,
      '8' + I18N.EM.Hour,
      '1' + I18N.EM.Day
    ])
  },
  getIntervalListByMin: function() {
    return ([
      60,
      120,
      240,
      480,
      1440
    ])
  },
  getDelayList: function() {
    return ([
      I18N.Setting.VEEMonitorRule.NoMonitorDelay,
      '15' + I18N.EM.Raw,
      '30' + I18N.EM.Raw,
      '1' + I18N.EM.Hour,
      '2' + I18N.EM.Hour
    ])
  },
  getDelayListByMin: function() {
    return ([
      0,
      15,
      30,
      60,
      120
    ])
  },
  setAllReceivers: function(receivers) {
    _allReceivers = Immutable.fromJS(receivers);
  },
  getAllReceivers: function() {
    return _allReceivers;
  },
  deleteRule: function(deletedId) {
    var deletedIndex = -1;

    if (_rules.size < 2) {
      _rules = emptyList();
      return 0;
    }

    var nextSelectedId = 0;

    _rules.every((item, index) => {
      if (item.get("Id") == deletedId) {
        deletedIndex = index;
        if (index == _rules.size - 1) {
          nextSelectedId = _rules.getIn([index - 1, "Id"]);
        } else {
          nextSelectedId = _rules.getIn([index + 1, "Id"]);
        }
        return false;
      }
      return true;
    });
    _rules = _rules.deleteIn([deletedIndex]);
    this.setRules(_rules.toJS());
    return nextSelectedId;
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
  addReceiversChangeListener(callback) {
    this.on(REVEIVERS_CHANGE_EVENT, callback);
  },
  removeReceiversChangeListener(callback) {
    this.removeListener(REVEIVERS_CHANGE_EVENT, callback);
  },
  emitReceiversChange(args) {
    this.emit(REVEIVERS_CHANGE_EVENT, args);
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
    case VEEAction.GET_VEE_ALL_RECEIVERS:
      VEEStore.setAllReceivers(action.receivers);
      VEEStore.emitReceiversChange();
      break;
    case VEEAction.VEE_ERROR:
      VEEStore.emitErrorhange({
        title: action.title,
        content: action.content
      });
      break;
    case VEEAction.DELETE_RULE_SUCCESS:
      var selecteId = VEEStore.deleteRule(action.id);
      VEEStore.setSelectedId(selecteId);
      VEEStore.emitChange(selecteId);
      break;
  }
});
module.exports = VEEStore;
