'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import {Action} from '../constants/actionType/Alarm.jsx';
import Ajax from '../ajax/ajax.jsx';


let ALarmAction = {
  changeDateType(dateType){
    AppDispatcher.dispatch({
        type: Action.DATETYPE_CHANGED,
        dateType: dateType
    });
  },
  changeDate(date,step){
    Ajax.post('/TargetBaseline.svc/GetAlarmTagIdsByDate', {
        params: {date:date,customerId:window.currentCustomerId, step: step},
        success: function(alarmList){
          AppDispatcher.dispatch({
              type: Action.DATALIST_CHANGED,
              alarmList: alarmList
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }
};

module.exports = ALarmAction;
