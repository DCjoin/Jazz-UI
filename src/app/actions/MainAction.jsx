'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import Ajax from '../ajax/ajax.jsx';
import {Action} from '../constants/actionType/Main.jsx';

let MainAction = {
  getAllUoms(){
    Ajax.post('/Administration/GetAllUoms', {
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
  getAllCommodities(){
    Ajax.post('/Administration/GetAllCommodity', {
        params: {},
        success: function(commodities){
          AppDispatcher.dispatch({
              type: Action.GET_ALL_COMMODITY_SUCCESS,
              commodities: commodities
          });
        },
        error: function(err, res){
          AppDispatcher.dispatch({
              type: Action.GET_ALL_COMMODITY_ERROR
          });
        }
    });
  }
};
module.exports = MainAction;
