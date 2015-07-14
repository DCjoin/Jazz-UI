'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Alarm.jsx';

const DASHBOARD_LIST_LOADED_EVENT ='DASHBOARD_LIST_LOADED_EVENT';
const DASHBOARD_ERROR_EVENT ='DASHBOARD_ERROR_EVENT';
const SAVE_DASHBOARD_SUCCESS_EVENT ='SAVE_DASHBOARD_SUCCESS_EVENT';


let _dashboardList = [],
    _dashboardMenuItems = [],
    _dashboard_error_code=0;

var DashboardStore = assign({},PrototypeStore,{
  onDashboardLoaded(dashboardList){
    _dashboardList = dashboardList;
    DashboardStore.convertDashboardList2MenuItems(dashboardList);
  },
  getDashboardList(){
    return _dashboardList;
  },
  getDashboardMenuItems(){
    return _dashboardMenuItems;
  },
  convertDashboardList2MenuItems(dashboardList){
    var menuItems = [],
        item, dashboard;
    for(let i=0,len=dashboardList.length; i<len; i++){
      dashboard = dashboardList[i];
      item = {
        text: dashboard.Name,
        id: dashboard.Id,
        hierId: dashboard.HierarchyId
      };
      menuItems.push(item);
    }
    _dashboardMenuItems = menuItems;
  },
  SaveToDashboardError:function(res){
    var errorCode=eval("(" + res + ")");
    _dashboard_error_code=errorCode.error.Code
  },
  saveToDashboardSuccess:function(){
    _dashboard_error_code=null
  },
  GetDashboardError:function(){
    var error={};
    switch(_dashboard_error_code){
          case "050001205015":
            error.chartTitle="该名称已存在";
            break;
          case "050001205016":
            error.oldDashboard="该仪表盘已满，无法保存新的图表";
            break;
          case "050001205001":
            error.newDashboard="该名称已存在";
            break;
    }
    return error;
  },
  addDashboardListLoadedListener: function(callback) {
    this.on(DASHBOARD_LIST_LOADED_EVENT, callback);
  },
  emitDashboardListLoaded: function() {
    this.emit(DASHBOARD_LIST_LOADED_EVENT);
  },
  removeDashboardListLoadedListener: function(callback) {
    this.removeListener(DASHBOARD_LIST_LOADED_EVENT, callback);
  },
  addDashboardErrorListener: function(callback) {
    this.on(DASHBOARD_ERROR_EVENT, callback);
  },
  emitDashboardError: function() {
    this.emit(DASHBOARD_ERROR_EVENT);
  },
  removeDashboardErrorListener: function(callback) {
    this.removeListener(DASHBOARD_ERROR_EVENT, callback);
  },
  addSaveDashboardSuccessListener: function(callback) {
    this.on(SAVE_DASHBOARD_SUCCESS_EVENT, callback);
  },
  emitSaveDashboardSuccess: function() {
    this.emit(SAVE_DASHBOARD_SUCCESS_EVENT);
  },
  removeSaveDashboardSuccessListener: function(callback) {
    this.removeListener(SAVE_DASHBOARD_SUCCESS_EVENT, callback);
  }
});

DashboardStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_DASHBOARD_BY_HIERARCHY_SUCCESS:
        DashboardStore.onDashboardLoaded(action.dashboardList);
        DashboardStore.emitDashboardListLoaded();
        break;
      case Action.GET_DASHBOARD_BY_HIERARCHY_ERROR:
        DashboardStore.onDashboardLoaded([]);
        break;
      case Action.SAVE_TO_DASHBOARD_SUCESS:
        DashboardStore.saveToDashboardSuccess();
          DashboardStore.emitSaveDashboardSuccess();
        break;
      case Action.SAVE_TO_DASHBOARD_ERROR:
          DashboardStore.SaveToDashboardError(action.res.text);
          DashboardStore.emitDashboardError();
        break;
    }
});

module.exports = DashboardStore;
