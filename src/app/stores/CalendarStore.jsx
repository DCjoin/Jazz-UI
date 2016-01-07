'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';

let _worktimeData = Immutable.fromJS([]),
  _selectedWorktimeIndex = null;
let CHANGE_WORKTIME_EVENT = 'changeworktime';
let CHANGE_SELECTED_WORKTIME_EVENT = 'changeselectedworktime';
var CalendarStore = assign({}, PrototypeStore, {
  getWorktimeData() {
    return _worktimeData;
  },
  setWorktimeData(worktimeData) {
    if (worktimeData) {
      _worktimeData = Immutable.fromJS(worktimeData);
    }
    if (_worktimeData.size !== 0) {
      _selectedWorktimeIndex = 0;
    }
  },
  getSelectedWorktimeIndex() {
    return _selectedWorktimeIndex;
  },
  emitWorktimeDataChange: function() {
    this.emit(CHANGE_WORKTIME_EVENT);
  },
  addWorktimeDataChangeListener: function(callback) {
    this.on(CHANGE_WORKTIME_EVENT, callback);
  },
  removeWorktimeDataChangeListener: function(callback) {
    this.removeListener(CHANGE_WORKTIME_EVENT, callback);
  },
  emitSelectedWorktimeChange: function() {
    this.emit(CHANGE_SELECTED_WORKTIME_EVENT);
  },
  addSelectedWorktimeDataChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_WORKTIME_EVENT, callback);
  },
  removeSelectedWorktimeDataChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_WORKTIME_EVENT, callback);
  },

});
CalendarStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_WORKTIME_DATA_SUCCESS:
      CalendarStore.setWorktimeData(action.worktimeData);
      CalendarStore.emitWorktimeDataChange();
      break;
    case Action.GET_WORKTIME_DATA_ERROR:
      CalendarStore.setWorktimeData([]);
      CalendarStore.emitWorktimeDataChange();
      break;

  }
});

module.exports = CalendarStore;
