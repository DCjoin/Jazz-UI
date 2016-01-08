'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';

let _worktimeList = Immutable.fromJS([]),
  _selectedWorktimeIndex = null,
  _selectedWorktime = null;
let CHANGE_WORKTIME_EVENT = 'changeworktime';
let CHANGE_SELECTED_WORKTIME_EVENT = 'changeselectedworktime';
var CalendarStore = assign({}, PrototypeStore, {
  getCalendarList(type) {
    switch (type) {
      case 1: return _worktimeList;
    }
  },
  setCalendarList(calendarList, type) {
    switch (type) {
      case 1: if (calendarList) {
          _worktimeList = Immutable.fromJS(calendarList);
        }
        if (_worktimeList.size !== 0) {
          if (_selectedWorktimeIndex === null) {
            _selectedWorktimeIndex = 0;
            _selectedWorktime = _worktimeList.get(0);
          } else {
            var index = _worktimeList.findIndex((item) => {
              if (item.get('Id') === _selectedWorktime.get('Id')) {
                return true;
              }
            });
            if (_selectedWorktimeIndex !== index) {
              _selectedWorktimeIndex = index;
            }
          }
        }
        break;
    }
  },
  mergeCalendar(calendar, type) {
    switch (type) {
      case 1: _worktimeList = _worktimeList.set(_selectedWorktimeIndex, Immutable.fromJS(calendar));
        _selectedWorktime = _worktimeList.get(_selectedWorktimeIndex);
        break;
    }
  },
  deleteCalendar(type) {
    switch (type) {
      case 1: _worktimeList = _worktimeList.delete(_selectedWorktimeIndex);
        var length = _worktimeList.size;
        if (length !== 0) {
          if (_selectedWorktimeIndex === length) {
            _selectedWorktimeIndex = length - 1;
          }
          _selectedWorktime = _worktimeList.get(_selectedWorktimeIndex);
        } else {
          _selectedWorktimeIndex = null;
          _selectedWorktime = null;
        }
        break;
    }
  },
  setSelectedCalendar(calendar, type) {
    switch (type) {
      case 1: _selectedWorktime = Immutable.fromJS(calendar);
        break;
    }
  },
  getSelectedCalendar(type) {
    switch (type) {
      case 1: return _selectedWorktime;
    }
  },
  getSelectedCalendarIndex(type) {
    switch (type) {
      case 1: return _selectedWorktimeIndex;
    }
  },
  setSelectedCalendarIndex(index, type) {
    switch (type) {
      case 1:
        _selectedWorktimeIndex = index;
        _selectedWorktime = _worktimeList.get(_selectedWorktimeIndex);
        break;
    }
  },
  emitCalendarListChange: function() {
    this.emit(CHANGE_WORKTIME_EVENT);
  },
  addCalendarListChangeListener: function(callback) {
    this.on(CHANGE_WORKTIME_EVENT, callback);
  },
  removeCalendarListChangeListener: function(callback) {
    this.removeListener(CHANGE_WORKTIME_EVENT, callback);
  },
  emitSelectedCalendarChange: function() {
    this.emit(CHANGE_SELECTED_WORKTIME_EVENT);
  },
  addSelectedCalendarChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_WORKTIME_EVENT, callback);
  },
  removeSelectedCalendarChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_WORKTIME_EVENT, callback);
  },

});
CalendarStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_WORKTIME_LIST_SUCCESS:
      CalendarStore.setCalendarList(action.calendarList, action.calendarType);
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      break;
    case Action.GET_WORKTIME_LIST_ERROR:
      CalendarStore.setCalendarList([], action.calendarType);
      CalendarStore.emitCalendarListChange();
      break;
    case Action.SET_SELECTED_WORKTIME:
      CalendarStore.setSelectedCalendarIndex(action.index, action.calendarType);
      CalendarStore.emitSelectedCalendarChange();
      break;
    case Action.CANCEL_SAVE_WORKTIME:
      CalendarStore.emitSelectedCalendarChange();
      break;
    case Action.MODIFT_WORKTIME_SUCCESS:
      CalendarStore.mergeCalendar(action.calendar, action.calendarType);
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      break;
    case Action.DELETE_WORKTIME_SUCCESS:
      CalendarStore.deleteCalendar(action.calendarType);
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      break;
    case Action.CREATE_WORKTIME_SUCCESS:
      CalendarStore.setSelectedCalendar(action.calendar, action.calendarType);
      break;
  }
});

module.exports = CalendarStore;
