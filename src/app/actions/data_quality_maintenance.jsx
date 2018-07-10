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
  getScanSwitch: ( hierarchyId ) => {
    AppDispatcher.dispatch({
      type: Action.GET_SCAN_SWITCH_REQUEST,
    });
    Ajax.get('/vee/getscanswitch' + '?hierarchyId=' + hierarchyId, {
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_SCAN_SWITCH_SUCCESS,
          data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  saveScanSwitch: (scanSwitch) => {
    AppDispatcher.dispatch({
      type: Action.GET_SCAN_SWITCH_REQUEST,
    });
    Ajax.post('/vee/savescanswitch', {
      params: scanSwitch,
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_SCAN_SWITCH_SUCCESS,
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
  getNodeSummary: (nodeId,nodeType,anomalyType,startTime,endTime) => {
   Ajax.get( Util.replacePathParams(Vee.getNodeSummary, nodeId, nodeType,anomalyType,startTime,endTime), {
		success: (data) => {
			AppDispatcher.dispatch({
				type: Action.GET_VEE_SUMMARY_SUCCESS,
				data
			});
		}
	});
  },
  updatereadstatus: (params,node) => {
    Ajax.post(Vee.updatereadstatus, {
      params,
      success: function() {
        AppDispatcher.dispatch({
          type: Action.UPDATE_READ_STATUS_SUCCESS,
          data:node
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
};
