'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Action } from '../constants/actionType/Calendar.jsx';

let _calendarList = Immutable.fromJS([]),
  _selectedCalendarIndex = null,
  _selectedCalendar = null,
  _calendarErrorTextArr = Immutable.fromJS([]);

let CHANGE_CALENDAR_EVENT = 'changecalendar';
let CHANGE_SELECTED_CALENDAR_EVENT = 'changeselectedcalendar';
let CHANGE_CALENDAR_ERROR_TEXT_EVENT = 'changetimeerrortext';
let ERROR_CHANGE_EVENT = 'errorchange';

var CalendarStore = assign({}, PrototypeStore, {
  getCalendarList() {
    return _calendarList;
  },
  clearAllCalendarErrorText() {
    for (var i = 0; i < _calendarErrorTextArr.size; i++) {
      _calendarErrorTextArr = _calendarErrorTextArr.set(i, '');
    }
  },
  setCalendarErrorText(index, errorText) {
    _calendarErrorTextArr = _calendarErrorTextArr.set(index, errorText);
  },
  getCalendarErrorText() {
    return _calendarErrorTextArr;
  },
  setCalendarList(calendarList) {
    _calendarList = Immutable.fromJS(calendarList);
    if (_calendarList.size !== 0) {
      if (_selectedCalendarIndex === null) {
        _selectedCalendarIndex = 0;
        _selectedCalendar = _calendarList.get(0);
      } else {
        if (_calendarList.getIn([0, 'Type']) !== _selectedCalendar.get('Type')) {
          _selectedCalendarIndex = 0;
          _selectedCalendar = _calendarList.get(0);
        } else {
          var index = _calendarList.findIndex((item) => {
            if (item.get('Id') === _selectedCalendar.get('Id')) {
              return true;
            }
          });
          if (index !== -1 && _selectedCalendarIndex !== index) {
            _selectedCalendarIndex = index;
          }
        }
      }
    } else {
      _selectedCalendarIndex = null;
      _selectedCalendar = null;
    }
  },
  deleteCalendar() {
    _calendarList = _calendarList.delete(_selectedCalendarIndex);
    var length = _calendarList.size;
    if (length !== 0) {
      if (_selectedCalendarIndex === length) {
        _selectedCalendarIndex = length - 1;
      }
      _selectedCalendar = _calendarList.get(_selectedCalendarIndex);
    } else {
      _selectedCalendarIndex = null;
      _selectedCalendar = null;
    }
  },
  setSelectedCalendar(calendar) {
    _selectedCalendar = Immutable.fromJS(calendar);
  },
  getSelectedCalendar() {
    return _selectedCalendar;
  },
  getSelectedCalendarIndex() {
    return _selectedCalendarIndex;
  },
  setSelectedCalendarIndex(index) {
    if (index === null) {
      _selectedCalendarIndex = null;
      _selectedCalendar = null;
    } else {
      _selectedCalendarIndex = index;
      _selectedCalendar = _calendarList.get(_selectedCalendarIndex);
    }
  },
  emitCalendarListChange: function() {
    this.emit(CHANGE_CALENDAR_EVENT);
  },
  addCalendarListChangeListener: function(callback) {
    this.on(CHANGE_CALENDAR_EVENT, callback);
  },
  removeCalendarListChangeListener: function(callback) {
    this.removeListener(CHANGE_CALENDAR_EVENT, callback);
  },
  emitSelectedCalendarChange: function() {
    this.emit(CHANGE_SELECTED_CALENDAR_EVENT);
  },
  addSelectedCalendarChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_CALENDAR_EVENT, callback);
  },
  removeSelectedCalendarChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_CALENDAR_EVENT, callback);
  },
  emitCalendarErrorTextChange: function() {
    this.emit(CHANGE_CALENDAR_ERROR_TEXT_EVENT);
  },
  addCalendarErrorTextChangeListener: function(callback) {
    this.on(CHANGE_CALENDAR_ERROR_TEXT_EVENT, callback);
  },
  removeCalendarErrorTextChangeListener: function(callback) {
    this.removeListener(CHANGE_CALENDAR_ERROR_TEXT_EVENT, callback);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },
  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },
  emitErrorhange() {
    this.emit(ERROR_CHANGE_EVENT);
  }
});
CalendarStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_CALENDAR_LIST_SUCCESS:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.setCalendarList(action.calendarList);
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.GET_CALENDAR_LIST_ERROR:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.setCalendarList([]);
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.SET_SELECTED_CALENDAR:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.setSelectedCalendarIndex(action.index);
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.CANCEL_SAVE_CALENDAR:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.MODIFT_CALENDAR_SUCCESS:
    case Action.CREATE_CALENDAR_SUCCESS:
      CalendarStore.setSelectedCalendar(action.calendar);
      break;
    case Action.DELETE_CALENDAR_SUCCESS:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.deleteCalendar();
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.MODIFT_CALENDAR_ERROR:
    case Action.CREATE_CALENDAR_ERROR:
    case Action.DELETE_CALENDAR_ERROR:
      CalendarStore.emitErrorhange();
      break;
    case Action.CLEAR_ALL_CALENDAR_ERROR_TEXT:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.SET_CALENDAR_ERROR_TEXT:
      CalendarStore.setCalendarErrorText(action.index, action.errorText);
      CalendarStore.emitCalendarErrorTextChange();
      break;
  }
});

module.exports = CalendarStore;
