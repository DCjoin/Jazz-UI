'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Setting.jsx';
import Ajax from '../ajax/ajax.jsx';

let BaselineModifyAction = {
  loadData(tbId, year){
    Ajax.post('/TargetBaseline.svc/GetTargetBaselineDataSetting', {
      params: {id: tbId,
               year: year},
      success: function(modifyData){
        AppDispatcher.dispatch({
            type: Action.GET_MODIFY_DATA,
            modifyData: modifyData
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
            type: Action.SET_MODIFY_DATA_SUCCESS
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
            type: Action.SET_MODIFY_DATA_ERROR
        });
      }
    });
  }
};

module.exports = BaselineModifyAction;
