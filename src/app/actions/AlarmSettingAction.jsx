'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Setting.jsx';
import Ajax from '../ajax/ajax.jsx';

let AlarmSettingAction = {
  loadData(tbId){
    Ajax.post('/TargetBaseline.svc/GetTBAlarmSetting', {
      params: {tbId: tbId},
      success: function(alarmSettingData){
        AppDispatcher.dispatch({
            type: Action.LOAD_SETTING_DATA,
            alarmSettingData: alarmSettingData
        });
      },
      error: function(err, res){
        console.log(err, res);
      }
    });
  },
  saveData(setting){
    Ajax.post('/TargetBaseline.svc/ModifyAlarmSetting', {
      params: setting,
      success: function(){
        AppDispatcher.dispatch({
            type: Action.SAVE_SETTING_SUCESS
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
            type: Action.SAVE_SETTING_ERROR
        });
      }
    });
  }
};

module.exports = AlarmSettingAction;
