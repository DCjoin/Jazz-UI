'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import TBSetting from '../constants/actionType/TBSetting.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = TBSetting.Action;

let TBSettingAction = {
  loadData(tbId, year, callback){
    Ajax.post('/TargetBaseline.svc/GetTBSetting2?', {
        params: {tbId: tbId, year: year},
        success: function(setting){
          console.log(setting);
          AppDispatcher.dispatch({
              type: Action.LOADED_TBSETTING,
              setting: setting
          });
          callback(setting);
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  saveData(setting){
    Ajax.post('/TargetBaseline.svc/SetTBSetting2?', {
        params: {dto: setting},
        success: function(setting2){
          console.log(setting2);
          AppDispatcher.dispatch({
              type: Action.SAVE_TBSETTING,
              setting: setting2
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  calcData(timeRange, tagId, callback){
    Ajax.post('/Energy.svc/GetTagAvgEnergyData?', {
        params: {timeRange: timeRange, tagId: tagId},
        success: function(data){
          callback(data);
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }
};

module.exports = TBSettingAction;
