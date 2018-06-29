'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/data_quality_maintenance.jsx';
import Ajax from '../ajax/Ajax.jsx';

module.exports = {
  getVEEDataStructure: (params) => {
    AppDispatcher.dispatch({
      type: Action.GET_VEE_DATA_STRUCTURE_REQUEST,
    });
    Ajax.post('/vee/getdatastructure', {
      params,
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_VEE_DATA_STRUCTURE_SUCCESS,
          data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
};
