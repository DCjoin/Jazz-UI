'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Setting.jsx';
import Ajax from '../ajax/ajax.jsx';

let AlarmSettingAction = {
  loadData(tbId){
    console.log(tbId);
    Ajax.post('/TargetBaseline.svc/GetTBAlarmSetting', {
      params: {tbId: tbId},
      success: function(alarmSettingData){
        console.log(alarmSettingData);
        AppDispatcher.dispatch({
            type: Action.LOAD_SETTING_DATA,
            alarmSettingData: alarmSettingData
        });
      },
      error: function(err, res){
        console.log(err, res);
      }
    });
  }



};

module.exports = AlarmSettingAction;
