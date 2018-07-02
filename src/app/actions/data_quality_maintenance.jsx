'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/data_quality_maintenance.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Util from 'util/Util.jsx';
import {Vee} from 'constants/Path.jsx';
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
  getAnomalyNotification: (nodeId,nodeType,anomalyType ) => {
   Ajax.get( Util.replacePathParams(Vee.getAnomaly, nodeId, nodeType,anomalyType), {
		success: (data) => {
			AppDispatcher.dispatch({
				type: Action.GET_VEE_TAG_ANOMALY_SUCCESS,
				data
			});
		}
	});
  },
};
