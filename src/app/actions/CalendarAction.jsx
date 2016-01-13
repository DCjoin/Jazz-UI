'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';
import Ajax from '../ajax/ajax.jsx';
let CalendarAction = {
  getCalendarListByType(type) {
    Ajax.post('/Administration.svc/GetCalendarsByType', {
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
  modifyCalendar(data) {
    Ajax.post('/Administration.svc/ModifyCalendar', {
      params: {
        dto: data
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_CALENDAR_SUCCESS,
          calendar: calendar
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  deleteCalendarById(id, version) {
    Ajax.post('/Administration.svc/DeleteCalendar', {
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
        console.log(err, res);
      }
    });
  },
  createCalendar(data, type) {
    var me = this;
    Ajax.post('/Administration.svc/CreateCalendar', {
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
