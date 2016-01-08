'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';
import Ajax from '../ajax/ajax.jsx';
let CalendarAction = {
  getWorktimeListByType() {
    Ajax.post('/Administration.svc/GetCalendarsByType', {
      params: {
        type: 1
      },
      success: function(worktimeList) {
        AppDispatcher.dispatch({
          type: Action.GET_WORKTIME_LIST_SUCCESS,
          worktimeList: worktimeList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_WORKTIME_LIST_ERROR
        });
      }
    });
  },
  setSelectedWorktimeIndex(index) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_WORKTIME,
      index: index
    });
  },
  cancelSave() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_WORKTIME
    });
  },
  modifyWorktime(data) {
    Ajax.post('/Administration.svc/ModifyCalendar', {
      params: {
        dto: data
      },
      success: function(worktime) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_WORKTIME_SUCCESS,
          worktime: worktime
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }
};
module.exports = CalendarAction;
