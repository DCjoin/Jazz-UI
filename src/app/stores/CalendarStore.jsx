'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';

let _workdayList = Immutable.fromJS([]),
  _selectedWorkdayIndex = null,
  _selectedWorkday = null,
  _worktimeList = Immutable.fromJS([]),
  _selectedWorktimeIndex = null,
  _selectedWorktime = null,
  _coldwarmList = Immutable.fromJS([]),
  _selectedColdwarmIndex = null,
  _selectedColdwarm = null,
  _daynightList = Immutable.fromJS([]),
  _selectedDaynightIndex = null,
  _selectedDaynight = null,
  _timeErrorTextArr = Immutable.fromJS([]),
  _dateErrorTextArr = Immutable.fromJS([]);
let _calendarList = [_workdayList, _worktimeList, _coldwarmList, _daynightList],
  _selecteCalendarIndex = [_selectedWorkdayIndex, _selectedWorktimeIndex, _selectedColdwarmIndex, _selectedDaynightIndex],
  _selecteCalendar = [_selectedWorkday, _selectedWorktime, _selectedColdwarm, _selectedDaynight];


let CHANGE_WORKDAY_EVENT = 'changeworkday';
let CHANGE_SELECTED_WORKDAY_EVENT = 'changeselectedworkday';
let CHANGE_WORKTIME_EVENT = 'changeworktime';
let CHANGE_SELECTED_WORKTIME_EVENT = 'changeselectedworktime';
let CHANGE_COLDWORM_EVENT = 'changecoldwarm';
let CHANGE_SELECTED_COLDWORM_EVENT = 'changeselectedcoldwarm';
let CHANGE_DAYNIGHT_EVENT = 'changedaynight';
let CHANGE_SELECTED_DAYNIGHT_EVENT = 'changeselecteddaynight';
let CHANGE_TIME_ERROR_TEXT_EVENT = 'changetimeerrortext';
let CHANGE_DATE_ERROR_TEXT_EVENT = 'changedateerrortext';

var CalendarStore = assign({}, PrototypeStore, {
  getCalendarList(type) {
    return _calendarList[type];
  },
  clearAllTimeErrorText() {
    for (var i = 0; i < _timeErrorTextArr.size; i++) {
      _timeErrorTextArr = _timeErrorTextArr.set(i, '');
    }
  },
  setTimeErrorText(index, errorText) {
    _timeErrorTextArr = _timeErrorTextArr.set(index, errorText);
  },
  getTimeErrorText() {
    return _timeErrorTextArr;
  },
  clearAllDateErrorText() {
    for (var i = 0; i < _timeErrorTextArr.size; i++) {
      _timeErrorTextArr = _timeErrorTextArr.set(i, '');
    }
  },
  setDateErrorText(index, errorText) {
    _timeErrorTextArr = _timeErrorTextArr.set(index, errorText);
  },
  getDateErrorText() {
    return _timeErrorTextArr;
  },
  setCalendarList(calendarList, type) {
    _calendarList[type] = Immutable.fromJS(calendarList);
    if (_calendarList[type].size !== 0) {
      if (_selecteCalendarIndex[type] === null) {
        _selecteCalendarIndex[type] = 0;
        _selecteCalendar[type] = _calendarList[type].get(0);
      } else {
        var index = _calendarList[type].findIndex((item) => {
          if (item.get('Id') === _selecteCalendar[type].get('Id')) {
            return true;
          }
        });
        if (_selecteCalendarIndex[type] !== index) {
          _selecteCalendarIndex[type] = index;
        }
      }
    } else {
      _selecteCalendarIndex[type] = null;
      _selecteCalendar[type] = null;
    }
  },
  modifyCalendar(calendar, type) {
    _calendarList[type] = _calendarList[type].set(_selecteCalendarIndex[type], Immutable.fromJS(calendar));
    _selecteCalendar[type] = _calendarList[type].get(_selecteCalendarIndex[type]);
  },
  deleteCalendar(type) {
    _calendarList[type] = _calendarList[type].delete(_selecteCalendarIndex[type]);
    var length = _calendarList[type].size;
    if (length !== 0) {
      if (_selecteCalendarIndex[type] === length) {
        _selecteCalendarIndex[type] = length - 1;
      }
      _selecteCalendar[type] = _calendarList[type].get(_selecteCalendarIndex[type]);
    } else {
      _selecteCalendarIndex[type] = null;
      _selecteCalendar[type] = null;
    }
  },
  setSelectedCalendar(calendar, type) {
    _selecteCalendar[type] = Immutable.fromJS(calendar);
  },
  setDefalutSelectedCalendar(type) {
    _selecteCalendar[type] = _calendarList[type].get(_selecteCalendarIndex[type]);
  },
  getSelectedCalendar(type) {
    return _selecteCalendar[type];
  },
  getSelectedCalendarIndex(type) {
    return _selecteCalendarIndex[type];
  },
  setSelectedCalendarIndex(index, type) {
    _selecteCalendarIndex[type] = index;
    _selecteCalendar[type] = _calendarList[type].get(_selecteCalendarIndex[type]);
  },
  clearAllErrorText: function(type) {
    var me = this;
    switch (type) {
      case 0:
      case 2:
        me.clearAllDateErrorText();
        break;
      case 1:
      case 3:
        me.clearAllTimeErrorText();
        break;
    }
  },
  emitCalendarListChange: function(type) {
    var me = this;
    switch (type) {
      case 0:
        me.emitWorkdayListChange();
        me.emitSelectedWorkdayChange();
        break;
      case 1:
        me.emitWorktimeListChange();
        me.emitSelectedWorktimeChange();
        break;
      case 2:
        me.emitColdwarmListChange();
        me.emitSelectedColdwarmChange();
        break;
      case 3:
        me.emitDaynightListChange();
        me.emitSelectedDaynightChange();
        break;
    }
  },
  emitSelectedCalendarChange: function(type) {
    var me = this;
    switch (type) {
      case 0:
        me.emitSelectedWorkdayChange();
        break;
      case 1:
        me.emitSelectedWorktimeChange();
        break;
      case 2:
        me.emitSelectedColdwarmChange();
        break;
      case 3:
        me.emitSelectedDaynightChange();
        break;
    }
  },
  emitCalendarErrorChange: function(type) {
    var me = this;
    switch (type) {
      case 0:
      case 2:
        me.emitDateErrorTextChange();
        break;
      case 1:
      case 3:
        me.emitTimeErrorTextChange();
        break;
    }
  },
  emitWorkdayListChange: function() {
    this.emit(CHANGE_WORKDAY_EVENT);
  },
  addWorkdayListChangeListener: function(callback) {
    this.on(CHANGE_WORKDAY_EVENT, callback);
  },
  removeWorkdayListChangeListener: function(callback) {
    this.removeListener(CHANGE_WORKDAY_EVENT, callback);
  },
  emitSelectedWorkdayChange: function() {
    this.emit(CHANGE_SELECTED_WORKDAY_EVENT);
  },
  addSelectedWorkdayChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_WORKDAY_EVENT, callback);
  },
  removeSelectedWorkdayChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_WORKDAY_EVENT, callback);
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
  emitColdwarmListChange: function() {
    this.emit(CHANGE_COLDWORM_EVENT);
  },
  addColdwarmListChangeListener: function(callback) {
    this.on(CHANGE_COLDWORM_EVENT, callback);
  },
  removeColdwarmListChangeListener: function(callback) {
    this.removeListener(CHANGE_COLDWORM_EVENT, callback);
  },
  emitSelectedColdwarmChange: function() {
    this.emit(CHANGE_SELECTED_COLDWORM_EVENT);
  },
  addSelectedColdwarmChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_COLDWORM_EVENT, callback);
  },
  removeSelectedColdwarmChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_COLDWORM_EVENT, callback);
  },
  emitDaynightListChange: function() {
    this.emit(CHANGE_DAYNIGHT_EVENT);
  },
  addDaynightListChangeListener: function(callback) {
    this.on(CHANGE_DAYNIGHT_EVENT, callback);
  },
  removeDaynightListChangeListener: function(callback) {
    this.removeListener(CHANGE_DAYNIGHT_EVENT, callback);
  },
  emitSelectedDaynightChange: function() {
    this.emit(CHANGE_SELECTED_DAYNIGHT_EVENT);
  },
  addSelectedDaynightChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_DAYNIGHT_EVENT, callback);
  },
  removeSelectedDaynightChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_DAYNIGHT_EVENT, callback);
  },
  emitTimeErrorTextChange: function() {
    this.emit(CHANGE_TIME_ERROR_TEXT_EVENT);
  },
  addTimeErrorTextChangeListener: function(callback) {
    this.on(CHANGE_TIME_ERROR_TEXT_EVENT, callback);
  },
  removeTimeErrorTextChangeListener: function(callback) {
    this.removeListener(CHANGE_TIME_ERROR_TEXT_EVENT, callback);
  },
  emitDateErrorTextChange: function() {
    this.emit(CHANGE_DATE_ERROR_TEXT_EVENT);
  },
  addDateErrorTextChangeListener: function(callback) {
    this.on(CHANGE_DATE_ERROR_TEXT_EVENT, callback);
  },
  removeDateErrorTextChangeListener: function(callback) {
    this.removeListener(CHANGE_DATE_ERROR_TEXT_EVENT, callback);
  }

});
CalendarStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_CALENDAR_LIST_SUCCESS:
      CalendarStore.clearAllErrorText(action.calendarType);
      CalendarStore.setCalendarList(action.calendarList, action.calendarType);
      CalendarStore.emitCalendarListChange(action.calendarType);
      CalendarStore.emitCalendarErrorChange(action.calendarType);
      break;
    case Action.GET_CALENDAR_LIST_ERROR:
      CalendarStore.clearAllErrorText(action.calendarType);
      CalendarStore.setCalendarList([], action.calendarType);
      CalendarStore.emitCalendarListChange(action.calendarType);
      CalendarStore.emitCalendarErrorChange(action.calendarType);
      break;
    case Action.SET_SELECTED_CALENDAR:
      CalendarStore.clearAllErrorText(action.calendarType);
      CalendarStore.setSelectedCalendarIndex(action.index, action.calendarType);
      CalendarStore.emitSelectedCalendarChange(action.calendarType);
      CalendarStore.emitCalendarErrorChange(action.calendarType);
      break;
    case Action.CANCEL_SAVE_CALENDAR:
      CalendarStore.clearAllErrorText(action.calendarType);
      CalendarStore.setDefalutSelectedCalendar(action.calendarType);
      CalendarStore.emitSelectedCalendarChange(action.calendarType);
      CalendarStore.emitCalendarErrorChange(action.calendarType);
      break;
    case Action.MODIFT_CALENDAR_SUCCESS:
      CalendarStore.clearAllErrorText(action.calendarType);
      CalendarStore.modifyCalendar(action.calendar, action.calendarType);
      CalendarStore.emitCalendarListChange(action.calendarType);
      CalendarStore.emitCalendarErrorChange(action.calendarType);
      break;
    case Action.DELETE_CALENDAR_SUCCESS:
      CalendarStore.clearAllErrorText(action.calendarType);
      CalendarStore.deleteCalendar(action.calendarType);
      CalendarStore.emitCalendarListChange(action.calendarType);
      CalendarStore.emitCalendarErrorChange(action.calendarType);
      break;
    case Action.CREATE_CALENDAR_SUCCESS:
      CalendarStore.clearAllErrorText(action.calendarType);
      CalendarStore.setSelectedCalendar(action.calendar, action.calendarType);
      CalendarStore.emitCalendarErrorChange(action.calendarType);
      break;
    case Action.CLEAR_ALL_TIME_ERROR_TEXT:
      CalendarStore.clearAllTimeErrorText();
      CalendarStore.emitTimeErrorTextChange();
      break;
    case Action.SET_TIME_ERROR_TEXT:
      CalendarStore.setTimeErrorText(action.index, action.errorText);
      CalendarStore.emitTimeErrorTextChange();
      break;
    case Action.CLEAR_ALL_DATE_ERROR_TEXT:
      CalendarStore.clearAllDateErrorText();
      CalendarStore.emitDateErrorTextChange();
      break;
    case Action.SET_DATE_ERROR_TEXT:
      CalendarStore.setDateErrorText(action.index, action.errorText);
      CalendarStore.emitDateErrorTextChange();
      break;
  }
});

module.exports = CalendarStore;
