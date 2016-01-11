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
          calendarList: calendarList,
          calendarType: type
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_CALENDAR_LIST_ERROR,
          calendarType: type
        });
      }
    });
  },
  setSelectedCalendarIndex(index, type) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_CALENDAR,
      index: index,
      calendarType: type
    });
  },
  cancelSaveCalendar(type) {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_CALENDAR,
      calendarType: type
    });
  },
  modifyCalendar(data, type) {
    Ajax.post('/Administration.svc/ModifyCalendar', {
      params: {
        dto: data
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_CALENDAR_SUCCESS,
          calendar: calendar,
          calendarType: type
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  deleteCalendarById(id, version, type) {
    Ajax.post('/Administration.svc/DeleteCalendar', {
      params: {
        dto: {
          Id: id,
          Version: version
        }
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_CALENDAR_SUCCESS,
          calendarType: type
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
          calendar: calendar,
          calendarType: type
        });
        me.getCalendarListByType(type);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }
};
module.exports = CalendarAction;
