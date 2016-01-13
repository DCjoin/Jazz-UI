'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';

let _calendarList = Immutable.fromJS([]),
  _selecteCalendarIndex = null,
  _selecteCalendar = null,
  _calendarErrorTextArr = Immutable.fromJS([]);

let CHANGE_CALENDAR_EVENT = 'changecalendar';
let CHANGE_SELECTED_CALENDAR_EVENT = 'changeselectedcalendar';
let CHANGE_CALENDAR_ERROR_TEXT_EVENT = 'changetimeerrortext';

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
      if (_selecteCalendarIndex === null) {
        _selecteCalendarIndex = 0;
        _selecteCalendar = _calendarList.get(0);
      } else {
        if (_calendarList.getIn([0, 'Type']) !== _selecteCalendar.get('Type')) {
          _selecteCalendarIndex = 0;
          _selecteCalendar = _calendarList.get(0);
        } else {
          var index = _calendarList.findIndex((item) => {
            if (item.get('Id') === _selecteCalendar.get('Id')) {
              return true;
            }
          });
          if (_selecteCalendarIndex !== index && index !== -1) {
            _selecteCalendarIndex = index;
          }
        }
      }
    } else {
      _selecteCalendarIndex = null;
      _selecteCalendar = null;
    }
  },
  modifyCalendar(calendar) {
    _calendarList = _calendarList.set(_selecteCalendarIndex, Immutable.fromJS(calendar));
    _selecteCalendar = _calendarList.get(_selecteCalendarIndex);
  },
  deleteCalendar() {
    _calendarList = _calendarList.delete(_selecteCalendarIndex);
    var length = _calendarList.size;
    if (length !== 0) {
      if (_selecteCalendarIndex === length) {
        _selecteCalendarIndex = length - 1;
      }
      _selecteCalendar = _calendarList.get(_selecteCalendarIndex);
    } else {
      _selecteCalendarIndex = null;
      _selecteCalendar = null;
    }
  },
  setSelectedCalendar(calendar) {
    _selecteCalendar = Immutable.fromJS(calendar);
  },
  setDefalutSelectedCalendar() {
    _selecteCalendar = _calendarList.get(_selecteCalendarIndex);
  },
  getSelectedCalendar() {
    return _selecteCalendar;
  },
  getSelectedCalendarIndex() {
    return _selecteCalendarIndex;
  },
  setSelectedCalendarIndex(index) {
    _selecteCalendarIndex = index;
    _selecteCalendar = _calendarList.get(_selecteCalendarIndex);
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
      CalendarStore.setDefalutSelectedCalendar();
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.MODIFT_CALENDAR_SUCCESS:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.modifyCalendar(action.calendar);
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.DELETE_CALENDAR_SUCCESS:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.deleteCalendar();
      CalendarStore.emitCalendarListChange();
      CalendarStore.emitSelectedCalendarChange();
      CalendarStore.emitCalendarErrorTextChange();
      break;
    case Action.CREATE_CALENDAR_SUCCESS:
      CalendarStore.clearAllCalendarErrorText();
      CalendarStore.setSelectedCalendar(action.calendar);
      CalendarStore.emitCalendarErrorTextChange();
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
