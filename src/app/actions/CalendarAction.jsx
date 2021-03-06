'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';
import Ajax from '../ajax/Ajax.jsx';
let CalendarAction = {
  getCalendarListByType(type) {
    Ajax.post('/Administration/GetCalendarsByType', {
      params: {
        type: type
      },
      success: function(calendarList) {
        AppDispatcher.dispatch({
          type: Action.GET_CALENDAR_LIST_SUCCESS,
          calendarList: calendarList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_CALENDAR_LIST_ERROR
        });
      }
    });
  },
  setSelectedCalendarIndex(index) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_CALENDAR,
      index: index
    });
  },
  cancelSaveCalendar() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_CALENDAR
    });
  },
  modifyCalendar(data, type) {
    var me = this;
    Ajax.post('/Administration/ModifyCalendar', {
      params: {
        dto: data
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_CALENDAR_SUCCESS,
          calendar: calendar
        });
        me.getCalendarListByType(type);
      },
      error: function(err, res) {
        console.log(err, res);
        AppDispatcher.dispatch({
          type: Action.MODIFT_CALENDAR_ERROR
        });
      }
    });
  },
  createCalendar(data, type) {
    var me = this;
    Ajax.post('/Administration/CreateCalendar', {
      params: {
        dto: data
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.CREATE_CALENDAR_SUCCESS,
          calendar: calendar
        });
        me.getCalendarListByType(type);
      },
      error: function(err, res) {
        console.log(err, res);
        AppDispatcher.dispatch({
          type: Action.CREATE_CALENDAR_ERROR,
        });
      }
    });
  },
  deleteCalendarById(id, version) {
    Ajax.post('/Administration/DeleteCalendar', {
      params: {
        dto: {
          Id: id,
          Version: version
        }
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_CALENDAR_SUCCESS
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.DELETE_CALENDAR_ERROR
        });
      }
    });
  },
  clearAllCalendarErrorText: function() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_ALL_CALENDAR_ERROR_TEXT
    });
  },
  setCalendarErrorText: function(index, errorText) {
    AppDispatcher.dispatch({
      type: Action.SET_CALENDAR_ERROR_TEXT,
      index: index,
      errorText: errorText
    });
  }
};
module.exports = CalendarAction;
