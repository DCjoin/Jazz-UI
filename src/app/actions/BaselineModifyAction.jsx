'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Setting.jsx';
import Ajax from '../ajax/ajax.jsx';

let BaselineModifyAction = {
  loadData(tbId, year){
    AppDispatcher.dispatch({
         type: Action.GET_BASELINE_DATA_LOADING
    });
    Ajax.post('/TargetBaseline/GetTargetBaselineDataSetting', {
      params: {
        tbId: tbId,
        year: year
      },
      success: function(modifyData){
        AppDispatcher.dispatch({
          type: Action.GET_BASELINE_DATA_SUCCESS,
          modifyData: modifyData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.GET_BASELINE_DATA_ERROR
        });
      }
    });
  },
  saveData(data){
    AppDispatcher.dispatch({
         type: Action.SET_BASELINE_DATA_LOADING
    });
    Ajax.post('/TargetBaseline/ModifyTargetBaselineDataSetting', {
      params: {dto: data},
      success: function(modifyData){
        AppDispatcher.dispatch({
          type: Action.SET_BASELINE_DATA_SUCCESS,
          modifyData: modifyData
        });
      },
      error: function(err, res){
        AppDispatcher.dispatch({
          type: Action.SET_BASELINE_DATA_ERROR
        });
      }
    });
  },
  setYearIsModify: function(){
    AppDispatcher.dispatch({
      type: Action.SET_YEAR_IS_MODIFY
    });
  },
  setMonthIsModify: function(index){
    AppDispatcher.dispatch({
      type: Action.SET_MONTH_IS_MODIFY,
      index: index
    });
  },
  setYearData: function(data){
    AppDispatcher.dispatch({
      type: Action.SET_YEAR_DATA,
      data: data
    });
  },
  setMonthData: function(index, data){
    AppDispatcher.dispatch({
      type: Action.SET_MONTH_DATA,
      index: index,
      data: data
    });
  }
};

module.exports = BaselineModifyAction;
