'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';

let _worktimeList = Immutable.fromJS([]),
  _selectedWorktimeIndex = null;
let CHANGE_WORKTIME_EVENT = 'changeworktime';
let CHANGE_SELECTED_WORKTIME_EVENT = 'changeselectedworktime';
var CalendarStore = assign({}, PrototypeStore, {
  getWorktimeList() {
    return _worktimeList;
  },
  setWorktimeList(worktimeList) {
    if (worktimeList) {
      _worktimeList = Immutable.fromJS(worktimeList);
    }
    if (worktimeList.size !== 0 && _selectedWorktimeIndex === null) {
      _selectedWorktimeIndex = 0;
    }
  },
  getSelectedWorktimeIndex() {
    return _selectedWorktimeIndex;
  },
  setSelectedWorktimeIndex(index) {
    _selectedWorktimeIndex = index;
  },
  emitWorktimeListChange: function() {
    this.emit(CHANGE_WORKTIME_EVENT);
  },
  addWorktimeListChangeListener: function(callback) {
    this.on(CHANGE_WORKTIME_EVENT, callback);
  },
  removeWorktimeListChangeListener: function(callback) {
    this.removeListener(CHANGE_WORKTIME_EVENT, callback);
  },
  emitSelectedWorktimeChange: function() {
    this.emit(CHANGE_SELECTED_WORKTIME_EVENT);
  },
  addSelectedWorktimeChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_WORKTIME_EVENT, callback);
  },
  removeSelectedWorktimeChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_WORKTIME_EVENT, callback);
  },

});
CalendarStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_WORKTIME_LIST_SUCCESS:
      CalendarStore.setWorktimeList(action.worktimeList);
      CalendarStore.emitWorktimeListChange();
      CalendarStore.emitSelectedWorktimeChange();
      break;
    case Action.GET_WORKTIME_LIST_ERROR:
      CalendarStore.setWorktimeList([]);
      CalendarStore.emitWorktimeListChange();
      break;
    case Action.SET_SELECTED_WORKTIME:
      CalendarStore.setSelectedWorktimeIndex(action.index);
      CalendarStore.emitSelectedWorktimeChange();
      break;
    case Action.CANCEL_SAVE_WORKTIME:
      CalendarStore.emitSelectedWorktimeChange();
      break;

  }
});

module.exports = CalendarStore;
