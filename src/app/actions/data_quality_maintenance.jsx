'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/data_quality_maintenance.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Util from 'util/Util.jsx';
import {Vee} from 'constants/Path.jsx';

var _structure_params=null;

var building={
  "id": 0,//层级节点ID
  "parentId": 0,//父节点ID
  "customerId": 0,//客户ID
  "name": "string",//名称
  "code": "string",
  "type": 0,//层级类型：Customer=-1，Organization=0,Site=1,Building=2,Room=3,Panel=4,Device=5,Gatway=6
  "systemIds": [//归属的产品类型 0,云能效;1,千里眼;2,机器顾问;8,信息顾问;32,变频顾问
      0
  ],
  "industryId": 8,//所属行业
  zoneId:1,
  "buildingArea": 0,//面积
  "finishingDate": "2018-06-08T06:38:39.038Z",//竣工日期
  "subType": 0,//楼宇类型：原来的建筑类型=1,项目=2,工厂车间=3
  "customerName": "string",//客户名称
  "logo": {//图标信息
      "id": 0,
      "hierarchyId": 0,
      "logo": "string",//图标的相对路径
      "imageId": "string"
  },
  "location": {//位置信息
      "buildingId": 0,
      latitude:40.00644,
      longitude:116.494155,
      "updateTime": "2018-06-08T06:38:39.039Z",
      "province": "string",//省
      "updateUser": "string",
      "updateUserId": 0,
      "cityId": 0,//城市ID
      "address": "北京市朝阳区施耐德大厦A座"//详细地址
  },
  "administrators": [//维护负责人
      {
      "id": 0,
      "hierarchyId": 0,
      "name": "string",//姓名
      "title": "string",//职位
      "telephone": "string",//电话
      "email": "string"//邮箱
      }
  ]
}
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
          type: Action.GET_ALL_INDUSTRIES_FOR_DATAQUALITY,
          data: industries
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
          type: Action.GET_ALL_ZONES_FOR_DATAQUALITY,
          data: zones
        });
        if(cb){cb()}
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getBuilding(customerId,id){
    var that=this;

    Ajax.get( Util.replacePathParams(Vee.getBuilding, id), {
      success: (data) => {
        that.getAllIndustries(customerId,()=>{
          that.getAllZones(customerId,()=>{
            AppDispatcher.dispatch({
              type: Action.GET_BUILDING_BASIC_SUCCESS,
              data
            });
          })
        })

      }
    });

 
  },

  // 获取基础属性页面数据
  getBasicPageData(params) {
    let url = '';
    switch(params.nodeType) {
      case 0:
          url = '/vee/info/org/';
          break;
      case 1:
          url = '/vee/info/site/';
          break;
      case 2:
          url = '/vee/info/building/';
          break;
      case 5:
          url = '/vee/info/device/';
          break;
      case 6:
          url = '/vee/info/gateway/';
          break;
      case 999:
          url = '/vee/info/tag/';
          break;
    }
    Ajax.get(url + params.id, {
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
    // Ajax.post('/vee/info/org', {
    //   params,
    //   success: function(data) {
    //     AppDispatcher.dispatch({
    //       type: Action.GET_BASIC_PROPERTY_DATA,
    //       data
    //     });
    //   },
    //   error: function(err, res) {
    //     console.log(err, res);
    //   }
    // });
  }
};

module.exports = DataQualityMaintenanceAction;
