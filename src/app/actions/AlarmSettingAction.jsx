'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Setting.jsx';
import Ajax from '../ajax/Ajax.jsx';

let AlarmSettingAction = {
  loadData(tbId){
    Ajax.post('/TargetBaseline/GetTBAlarmSetting', {
      params: {tbId: tbId},
      success: function(alarmSettingData){
        AppDispatcher.dispatch({
          type: Action.GET_ALARM_DATA_SUCCESS,
          alarmSettingData: alarmSettingData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_ALARM_DATA_ERROR
        });
      }
    });
  },
  saveData(setting){
    Ajax.post('/TargetBaseline/ModifyAlarmSetting', {
      params: setting,
      success: function(alarmSettingData){
        AppDispatcher.dispatch({
          type: Action.SET_ALARM_DATA_SUCCESS,
          alarmSettingData: alarmSettingData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.SET_ALARM_DATA_ERROR
        });
      }
    });
  }
};

module.exports = AlarmSettingAction;
