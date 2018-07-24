'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/data_quality_maintenance.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Util from 'util/Util.jsx';
import {Vee} from 'constants/Path.jsx';

var _structure_params=null;
let DataQualityMaintenanceAction = {
  getVEEDataStructure: (params,refresh=true) => {
    if(refresh){AppDispatcher.dispatch({
      type: Action.GET_VEE_DATA_STRUCTURE_REQUEST,
    });}
    _structure_params=params;
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
  getrulebyid:(params)=>{
    Ajax.post(Vee.getrulebyid, {
      params,
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_RULE_BY_ID_SUCCESS,
          data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  updateRule(params){

    var that= this ;
    Ajax.post(Vee.updateRule, {
      params,
      success: function() {
        AppDispatcher.dispatch({
          type: Action.GET_RULE_BY_ID_SUCCESS,
          data:params[0].Rule
        });
        that.getVEEDataStructure(_structure_params,false);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getHierarchys(params){
    Ajax.post(Vee.getdatastructurewithouttag, {
      params,
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_TAG_SELECT_HIERARCHY_SUCCESS,
          data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getTags(params){
    Ajax.post(Vee.getdatastructuretags, {
      params,
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_DATA_STRUCTURE_TAGS,
          data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },

  getAllIndustries: function(customerId,cb) {
    var that = this;
    Ajax.post('/Administration/GetAllIndustries', {
      params: {
        includeRoot: false,
        onlyLeaf: true,
        sysId:1
      },
      success: function(industries) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_FOR_HIERARCHY,
          industries: industries
        });
        if(cb){cb()}
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getAllZones: function(customerId,cb) {
    var that = this;
    Ajax.post('/Administration/GetAllZones', {
      params: {
        includeRoot: false
      },
      success: function(zones) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_FOR_HIERARCHY,
          zones: zones
        });
        if(cb){cb()}
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getBuilding(){
  },

  // 获取基础属性页面数据
  getBasicPageData(params) {
    let url = '';
    switch(params.NodeType) {
      case 0:
          url = '/vee/info/org/' + params.id;
          break;
      case 1:
          url = '/vee/info/site/' + params.id;
          break;
      case 2:
          url = '/vee/info/building/' + params.id;
          break;
      case 5:
          url = '/vee/info/device/' + params.id;
          break;
      case 6:
          url = '/vee/info/gateway/' + params.id + '/' + params.SubType;
          break;
      case 999:
          url = '/vee/info/tag/' + params.id;
          break;
    }
    Ajax.get(url, {
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_BASIC_PROPERTY_DATA,
          data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }
};

module.exports = DataQualityMaintenanceAction;
