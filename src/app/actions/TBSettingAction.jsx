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
          if(callback) callback(setting);
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  saveData(setting, callback, fail){
    Ajax.post('/TargetBaseline.svc/SetTBSetting2?', {
        params: {dto: setting},
        success: function(setting2){
          console.log(setting2);
          AppDispatcher.dispatch({
              type: Action.SAVE_TBSETTING,
              setting: setting2
          });
          if(callback) callback(setting2);
        },
        error: function(err, res){
          console.log(err,res);
          if(fail) fail(err, res);
        }
    });
  },
  calcData(timeRange, tagId, callback){
    Ajax.post('/Energy.svc/GetTagAvgEnergyData?', {
        params: {timeRange: timeRange, tagId: tagId},
        success: function(data){
          if(callback) callback(data);
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  calDetailData(hierId){
    Ajax.post('/Hierarchy.svc/GetHierarchyCalendarByHierarchyId', {
         params: {
           hierarchyId:hierId
          },
        success: function(data){
          AppDispatcher.dispatch({
              type: Action.LOAD_CALDETAIL,
              data: data
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  setHierId(hierId){
    AppDispatcher.dispatch({
        type: Action.SET_HIERID,
        hierId: hierId
    });
  },
  setTagId(tagId){
    AppDispatcher.dispatch({
        type: Action.SET_TAGID,
        tagId: tagId
    });
  },
  resetHierId(){
    AppDispatcher.dispatch({
        type: Action.RESET_HIERID,
    });
  },
  resetTagId(){
    AppDispatcher.dispatch({
        type: Action.RESET_HIERID,
    });
  },
  setYear(year){
    AppDispatcher.dispatch({
        type: Action.SET_YEAR,
        year:year
    });
  }

};

module.exports = TBSettingAction;
