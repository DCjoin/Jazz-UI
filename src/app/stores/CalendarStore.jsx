'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';

let _worktimeList = Immutable.fromJS([]),
  _selectedWorktimeIndex = null,
  _addWorktime = null;
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
    if (_worktimeList.size !== 0 && _selectedWorktimeIndex === null) {
      _selectedWorktimeIndex = 0;
    }
  },
  mergeWorktime(worktime) {
    _worktimeList = _worktimeList.set(_selectedWorktimeIndex, Immutable.fromJS(worktime));
  },
  deleteWorktime() {
    _worktimeList = _worktimeList.delete(_selectedWorktimeIndex);
    var length = _worktimeList.size;
    if (length !== 0) {
      if (_selectedWorktimeIndex === length) {
        _selectedWorktimeIndex = length - 1;
      }
    } else {
      _selectedWorktimeIndex = null;
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
    case Action.MODIFT_WORKTIME_SUCCESS:
      CalendarStore.mergeWorktime(action.worktime);
      CalendarStore.emitWorktimeListChange();
      CalendarStore.emitSelectedWorktimeChange();
      break;
    case Action.DELETE_WORKTIME_SUCCESS:
      CalendarStore.deleteWorktime();
      CalendarStore.emitWorktimeListChange();
      CalendarStore.emitSelectedWorktimeChange();
      break;
  }
});

module.exports = CalendarStore;
