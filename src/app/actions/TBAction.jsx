'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import TB from '../constants/actionType/TB.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = TB.Action;

let TBAction = {
  loadData(tagId){
    Ajax.post('/TargetBaseline.svc/GetTBsByVTag?', {
        params: {vtagId: tagId},
        success: function(tbs){
          console.log(tbs);
          AppDispatcher.dispatch({
              type: Action.LOAD_TB,
              tbs: tbs
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  saveData(data){
    Ajax.post('/TargetBaseline.svc/ModifyTB?', {
        params: {dto: data},
        success: function(dto){
          console.log(dto);
          AppDispatcher.dispatch({
              type: Action.SAVE_TB,
              tbs: dto
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }
};

module.exports = TBAction;
