'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import Ajax from '../ajax/ajax.jsx';
import {Action} from '../constants/actionType/Main.jsx';

let MainAction = {
  getAllUoms(){
    Ajax.post('/Administration.svc/GetAllUoms', {
        params: {},
        success: function(uoms){
          AppDispatcher.dispatch({
              type: Action.GET_ALL_UOMS_SUCCESS,
              uoms: uoms
          });
        },
        error: function(err, res){
          AppDispatcher.dispatch({
              type: Action.GET_ALL_UOMS_ERROR
          });
        }
    });
  },
};
module.exports = MainAction;
