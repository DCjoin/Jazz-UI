import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import CurrentUser from '../constants/actionType/CurrentUser.jsx';
import Measures from '../constants/actionType/Measures.jsx';
import Diagnose from '../constants/actionType/Diagnose.jsx';
import LoginActionType from '../constants/actionType/Login.jsx';
import RoutePath from '../util/RoutePath.jsx';
import PermissionCode from '../constants/PermissionCode.jsx';
import _ from 'lodash';
import DataAnalysis from '../constants/actionType/DataAnalysis.jsx';

let _currentUser = null,
  _error = null,
  _currentPrivilege = null,
  _ecmHasBubble=false,
  _diagnoseHasBubble=false,
  _dataAnalysisMenu=null;
let CURRENT_USER_EVENT = 'currentuser',
  PASSWORD_ERROR_EVENT = 'passworderror',
  PASSWORD_SUCCESS_EVENT = 'passwordsuccess',
  CURRENT_PRIVILEGE_EVENT = 'currentprivilege';

const PRIVILEGE_ADMIN = [
  PermissionCode.MAP_VIEW.READONLY,
  PermissionCode.ENERGY_MANAGE.FULL,
  PermissionCode.ENERGY_EXPORT.FULL,
  PermissionCode.DATA_REPORT_MANAGEMENT.FULL,
  PermissionCode.ENERGY_ALARM.FULL,
  PermissionCode.PLATFORM_MANAGEMENT.FULL,
  PermissionCode.HIERARCHY_MANAGEMENT.FULL,
  PermissionCode.TAG_MANAGEMENT.FULL,
  PermissionCode.CUSTOM_LABELING.FULL,
  PermissionCode.BASELINE_CONFIG.FULL,
  PermissionCode.INDEX_AND_REPORT.FULL,
  PermissionCode.SENIOR_DATA_ANALYSE.FULL,
  PermissionCode.BUILDING_LIST.FULL,
  PermissionCode.PUSH_SOLUTION.FULL,
  PermissionCode.SOLUTION_FULL.FULL,
  PermissionCode.BASIC_SMART_DIACRISIS.FULL,
  PermissionCode.SENIOR_SMART_DIACRISIS.FULL,
  PermissionCode.SMART_DIACRISIS_LIST.FULL,
].map( code => '' + code );

var CurrentUserStore = assign({}, PrototypeStore, {

  setCurrentUser: function(userInfo) {
    _currentUser = userInfo;
  },
  getCurrentUser: function() {
    return _currentUser;
  },
  updateCurrentUser: function(version) {
    _currentUser.Version = version;
  },
  setPasswordError: function(res) {
    var errorCode = eval("(" + res + ")");
    _error = errorCode.error.Code;
  },
  getError: function() {
    return _error;
  },
  getUserTitle: function() {
    return ([
      I18N.Setting.User.EnergyConsultant,
      I18N.Setting.User.Technicist,
      I18N.Setting.User.CustomerManager,
      I18N.Setting.User.PlatformManager,
      I18N.Setting.User.EnergyManager,
      I18N.Setting.User.EnergyEngineer,
      I18N.Setting.User.DeptManager,
      I18N.Setting.User.Manager,
      I18N.Setting.User.BusinessPerson,
      I18N.Setting.User.Sales,
      I18N.Setting.User.ServerManager
    ]);
  },
  getCommonPrivilegeList: function() {
    return ([
      // I18N.Privilege.Common.DashboardView,
      // I18N.Privilege.Common.DashboardManagement,
      I18N.Privilege.Common.MapView,
      I18N.Privilege.Common.EnergyManager,
      I18N.Privilege.Common.PersonalInfoManagement,
    ]);
  },
  getRolePrivilegeList: function() {
    var array = [],
      role = [];

    // role = [I18N.Privilege.Role.DashboardSharing,
    //   I18N.Privilege.Role.EnergyUsage,
    //   I18N.Privilege.Role.CarbonEmission,
    //   I18N.Privilege.Role.EnergyCost,
    //   '',
    //   I18N.Privilege.Role.EnergyExport,
    //   I18N.Privilege.Role.SPManagement,
    //   I18N.Privilege.Role.HierarchyManagement,
    //   I18N.Privilege.Role.TagManagement,
    //   '',
    //   I18N.Privilege.Role.TagMapping,
    //   I18N.Privilege.Role.CustomerInfoView,
    //   I18N.Privilege.Role.CustomerInfoManagement,
    //   I18N.Privilege.Role.UnitIndicator,
    //   I18N.Privilege.Role.RatioIndicator,
    //   I18N.Privilege.Role.CorporateRanking,
    //   I18N.Privilege.Role.LabelingIndicator,
    //   I18N.Privilege.Role.CustomLabeling,
    //   I18N.Privilege.Role.ReportView,
    //   I18N.Privilege.Role.ReportManagement,
    //   I18N.Privilege.Role.ChartRemarking,
    //   I18N.Privilege.Role.EnergyAlarm,
    //   '',
    //   I18N.Privilege.Role.BaselineConfiguration,
    // ];
    // role.forEach((item, index) => {
    //   array[1200 + index] = item;
    // });
    array[1205] = I18N.Privilege.Role.EnergyExport;
    array[1218] = I18N.Privilege.Role.ReportView;
    array[1219] = I18N.Privilege.Role.ReportManagement;
    array[1221] = I18N.Privilege.Role.EnergyAlarm;
    array[1206] = I18N.Privilege.Role.SPManagement;
    array[1207] = I18N.Privilege.Role.HierarchyManagement;
    array[1208] = I18N.Privilege.Role.TagManagement;
    //  array[1210] = I18N.Privilege.Role.TagMapping;
    array[1217] = I18N.Privilege.Role.CustomLabeling;
    array[1223] = I18N.Privilege.Role.BaselineConfiguration;
    return array;
  },
  setPasswordSuccess: function() {
    _error = null;
  },
  setCurrentPrivilege: function(role, useId, userType) {
    if (useId == 100001 || useId == 1 || userType == -1) {
      _currentPrivilege = PRIVILEGE_ADMIN;

    } else {
      _currentPrivilege = role.PrivilegeCodes;
    }
  },
  getCurrentPrivilege: function() {
    return _currentPrivilege;
  },
  getCurrentPrivilegeByUser: function(user, userRoleList) {
    var privilege = [];
    if (user.Id == 100001 || user.Id == 1 || user.UserType == -1) {
      privilege = PRIVILEGE_ADMIN;

    } else {
      userRoleList.forEach(role => {
        if (role.Id == user.UserType) {
          privilege = role.PrivilegeCodes;
        }
      });
    }
    return privilege;
  },
  permit:function(code){
  if (!_currentPrivilege || _currentPrivilege.length===0){
    return false;
  }

  return this.getCurrentPrivilege().indexOf(code+'')>-1;

  },
  //未读标志
  setEcmBubble:function(data){
    _ecmHasBubble=_.indexOf(data,true)>-1;
  },
  getEcmBubble:function(){
    return _ecmHasBubble;
  },
  //诊断问题标志
  setDiagnoseBubble:function(data){
    _diagnoseHasBubble=data[2] || data[4];
  },
  getDiagnoseBubble:function(){
    return _diagnoseHasBubble;
  },
  //录入数据
  setInputDataMenu(tagData){
    var _tagList=tagData===null?[]:tagData.Data;

    if(_tagList.length!==0){
      _dataAnalysisMenu=      {
              name: 'dataAnalysis',
              title: I18N.MainMenu.DataAnalysis,
              children: [{
                list: [
                  {
                    name: 'analysis',
                    getPath: RoutePath.dataAnalysis,
                    title: I18N.MainMenu.DataAnalysis
                  },
                  {
                    name: 'inputData',
                    getPath: RoutePath.inputData,
                    title: I18N.MainMenu.InputData
                  }
                ]
              }]
            }
    }
  },
  getDataAnalysisMenu(){
    if(_dataAnalysisMenu===null){
      _dataAnalysisMenu={
            getPath: RoutePath.dataAnalysis,
            title: I18N.MainMenu.DataAnalysis
          }
    }
    return _dataAnalysisMenu
  },
  getMainMenuItems: function() {
    var menuItems = [];
    if (!this.getCurrentPrivilege()) return

    if (this.permit(PermissionCode.INDEX_AND_REPORT.READONLY) || this.permit(PermissionCode.INDEX_AND_REPORT.FULL)) {
      menuItems.push(
        {
          getPath: RoutePath.Actuality,
          title: I18N.MainMenu.KPI,
        }
      );
    }

    if ( this.permit(PermissionCode.SENIOR_DATA_ANALYSE.FULL) ||
          this.permit(PermissionCode.PUSH_SOLUTION.READONLY)  ||
          this.permit(PermissionCode.PUSH_SOLUTION.FULL) ) {
      menuItems.push(
        {
          getPath: RoutePath.ecm,
          hasBubble:this.getEcmBubble(),
          title: I18N.MainMenu.SaveSchemeTab
        }
      );
    }

    if ( this.permit(PermissionCode.BASIC_SMART_DIACRISIS.FULL) || this.permit(PermissionCode.BASIC_SMART_DIACRISIS.READONLY)
        || this.permit(PermissionCode.SMART_DIACRISIS_LIST.FULL)) {
      menuItems.push(
        {
          getPath: RoutePath.smartDiagnose,
          hasBubble:this.getDiagnoseBubble(),
          title:I18N.MainMenu.SmartDiagnose
        }
      );
    }


    if ( this.permit(PermissionCode.BASIC_DATA_ANALYSE.FULL) || this.permit(PermissionCode.SENIOR_DATA_ANALYSE.FULL) ) {
      menuItems.push(
        this.getDataAnalysisMenu()
      );
    }

    if (this.permit(PermissionCode.MAP_VIEW.READONLY)) {
      menuItems.push(
        {
          getPath: RoutePath.map,
          title: I18N.MainMenu.Map
        }
      );
    }

    // if (this.permit(PermissionCode.ENERGY_ALARM.FULL)) {
    //   menuItems.push(
    //     {
    //       getPath: RoutePath.alarm,
    //       title: I18N.MainMenu.Alarm
    //     }
    //   );
    // }

    if (this.permit(PermissionCode.ENERGY_MANAGE.FULL)) {
      menuItems.push(
        {
          getPath: RoutePath.setting,
          title: I18N.MainMenu.Energy
        }
      );
    }


    if (this.permit(PermissionCode.DATA_REPORT_MANAGEMENT.FULL)|| this.permit(PermissionCode.DATA_REPORT_MANAGEMENT.READONLY)) {
      menuItems.push(
        {
          name: 'report',
          title: I18N.MainMenu.Report,
          children: [{
            list: [
              {
                name: 'dailyReport',
                getPath: RoutePath.report.dailyReport,
                title: I18N.MainMenu.DailyReport
              },
              {
                name: 'template',
                getPath: RoutePath.report.template,
                title: I18N.MainMenu.Template
              }
            ]
          }]
        }
      );
    }
    if (this.permit(PermissionCode.TAG_MANAGEMENT.FULL)|| this.permit(PermissionCode.HIERARCHY_MANAGEMENT.FULL) || this.permit(PermissionCode.CUSTOM_LABELING.FULL)) {
      var customerChildren = [];
      if (this.permit(PermissionCode.TAG_MANAGEMENT.FULL)) {
        customerChildren = [{
          title: I18N.MainMenu.TagSetting,
          list: [
            {
              name: 'ptag',
              getPath: RoutePath.customerSetting.ptag,
              title: I18N.MainMenu.PTagManagement
            },
            {
              name: 'vtag',
              getPath: RoutePath.customerSetting.vtag,
              title: I18N.MainMenu.VTagManagement
            },
            {
              name: 'vee',
              getPath: RoutePath.customerSetting.vee,
              title: I18N.MainMenu.VEEMonitorRule
            },
            {
              name: 'log',
              getPath: RoutePath.customerSetting.log,
              title: I18N.MainMenu.TagBatchImportLog
            }
          ]
        }];
      }
      if (this.permit(PermissionCode.HIERARCHY_MANAGEMENT.FULL)) {
        customerChildren.push({
          title: I18N.MainMenu.HierarchySetting,
          list: [
            {
              name: 'hierNode',
              getPath: RoutePath.customerSetting.hierNode,
              title: I18N.MainMenu.HierarchyNodeSetting
            },
            {
              name: 'hierLog',
              getPath: RoutePath.customerSetting.hierLog,
              title: I18N.MainMenu.HierarchyLog
            }
          ]
        });
      }
      if (this.permit(PermissionCode.CUSTOM_LABELING.FULL)) {
        customerChildren.push({
          title: I18N.MainMenu.CustomSetting,
          list: [
            {
              getPath: RoutePath.customerSetting.customerLabeling,
              title: I18N.MainMenu.CustomizedLabeling
            },
            {
              getPath: RoutePath.customerSetting.KPICycle,
              title: I18N.MainMenu.KPICycle
            },
          ]
        });
      }
      menuItems.push({
        name: 'customerSetting',
        title: I18N.MainMenu.CustomerSetting,
        children: customerChildren
      });
    }

    if(menuItems.length===0){
      menuItems.push(
        {
          getPath: RoutePath.blankPage,
        }
      );
    }
    return menuItems;
  },
  resetAllFalg(){
    _ecmHasBubble=false;
    _diagnoseHasBubble=false;
    _dataAnalysisMenu=null;
  },
  emitCurrentUserChange: function() {
    this.emit(CURRENT_USER_EVENT);
  },
  addCurrentUserListener: function(callback) {
    this.on(CURRENT_USER_EVENT, callback);
  },

  removeCurrentUserListener: function(callback) {
    this.removeListener(CURRENT_USER_EVENT, callback);
    this.dispose();
  },
  emitCurrentrivilegeChange: function() {
    this.emit(CURRENT_PRIVILEGE_EVENT);
  },
  addCurrentrivilegeListener: function(callback) {
    this.on(CURRENT_PRIVILEGE_EVENT, callback);
  },

  removeCurrentrivilegeListener: function(callback) {
    _error = null;
    //_currentPrivilege = null;
    this.removeListener(CURRENT_PRIVILEGE_EVENT, callback);
    this.dispose();
  },
  emitPasswordErrorChange: function() {
    this.emit(PASSWORD_ERROR_EVENT);
  },
  addPasswordErrorListener: function(callback) {
    this.on(PASSWORD_ERROR_EVENT, callback);
  },

  removePasswordErrorListener: function(callback) {
    this.removeListener(PASSWORD_ERROR_EVENT, callback);
    this.dispose();
  },
  emitPasswordSuccessChange: function() {
    this.emit(PASSWORD_SUCCESS_EVENT);
  },
  addPasswordSuccessListener: function(callback) {
    this.on(PASSWORD_SUCCESS_EVENT, callback);
  },

  removePasswordSuccessListener: function(callback) {
    this.removeListener(PASSWORD_SUCCESS_EVENT, callback);
    this.dispose();
  },

});

var CurrentUserAction = CurrentUser.Action,
    MeasuresAction=Measures.Action,
    DiagnoseAction=Diagnose.Action,
    DataAnalysisAction=DataAnalysis.Action;

CurrentUserStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case CurrentUserAction.GET_USER:
      CurrentUserStore.setCurrentUser(action.userInfo);
      CurrentUserStore.emitCurrentUserChange();
      break;
    case CurrentUserAction.PASSWORD_ERROR:
      CurrentUserStore.setPasswordError(action.res.text);
      CurrentUserStore.emitPasswordErrorChange();
      break;
    case CurrentUserAction.PASSWORD_SUCCESS:
      CurrentUserStore.updateCurrentUser(action.version);
      CurrentUserStore.setPasswordSuccess();
      CurrentUserStore.emitPasswordSuccessChange();
      break;
    case CurrentUserAction.GET_ROLE:
      CurrentUserStore.setCurrentPrivilege(action.role, action.userId, action.userType);
      CurrentUserStore.emitCurrentrivilegeChange();
      break;
    case LoginActionType.Action.LOGOUT:
      _currentUser = null;
      _currentPrivilege = null;
      _error = null;
      break;
    //已读未读修改
    case MeasuresAction.GET_CONTAINS_UNREAD:
      CurrentUserStore.setEcmBubble(action.data);
      CurrentUserStore.emitCurrentUserChange();
      break;
   //诊断问题
   case DiagnoseAction.GET_DIAGNOSIS_STATIC:
       CurrentUserStore.setDiagnoseBubble(action.data);
       CurrentUserStore.emitCurrentUserChange()
       break;
    //是否添加录入数据二级菜单（数据分析）
    case DataAnalysisAction.GET_MANUAL_TAGS:
        CurrentUserStore.setInputDataMenu(action.tagData);
        CurrentUserStore.emitCurrentUserChange()
        break;
    //切换层级时清空所有标志
  case DataAnalysisAction.RESET_MENU_FLAG:
        CurrentUserStore.resetAllFalg();
        CurrentUserStore.emitCurrentUserChange()
        break;
  }
});

module.exports = CurrentUserStore;
