'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Calendar.jsx';
import Ajax from '../ajax/ajax.jsx';
let CalendarAction = {
  getWorktimeDataByType() {

    Ajax.post('/Administration.svc/GetCalendarsByType', {
      params: {
        type: 1
      },
      success: function(worktimeData) {
        AppDispatcher.dispatch({
          type: Action.GET_WORKTIME_DATA_SUCCESS,
          worktimeData: worktimeData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_WORKTIME_DATA_ERROR
        });
      }
    });
  },
};
module.exports = CalendarAction;
