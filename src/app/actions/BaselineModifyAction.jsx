'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Setting.jsx';
import Ajax from '../ajax/ajax.jsx';

let BaselineModifyAction = {
  loadData(tbId, year){
    AppDispatcher.dispatch({
         type: Action.GET_BASELINE_DATA_LOADING
    });
    Ajax.post('/TargetBaseline.svc/GetTargetBaselineDataSetting', {
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
    Ajax.post('/TargetBaseline.svc/ModifyTargetBaselineDataSetting', {
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
  }
};

module.exports = BaselineModifyAction;
