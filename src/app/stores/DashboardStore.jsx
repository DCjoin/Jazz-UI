'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Alarm.jsx';

const DASHBOARD_LIST_LOADED_EVENT ='DASHBOARD_LIST_LOADED_EVENT';

let _dashboardList = [],
    _dashboardMenuItems = [];

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

  addDashboardListLoadedListener: function(callback) {
    this.on(DASHBOARD_LIST_LOADED_EVENT, callback);
  },
  emitDashboardListLoaded: function() {
    this.emit(DASHBOARD_LIST_LOADED_EVENT);
  },
  removeDashboardListLoadedListener: function(callback) {
    this.removeListener(DASHBOARD_LIST_LOADED_EVENT, callback);
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
    }
});

module.exports = DashboardStore;
