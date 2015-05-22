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
  changeDate(date){
    var url = '/building/create';
        Ajax.post(url, {
            params: {},
            success: function(resBody){

                AppDispatcher.dispatch({
                  type:Action.DATEVALUE_CHANGED,
                  date: date,
                  data: resBody
                });
            },
            error: function(err, res){
            }
        });
  }
};

module.exports = ALarmAction;
