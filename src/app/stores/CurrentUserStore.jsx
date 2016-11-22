import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import CurrentUser from '../constants/actionType/CurrentUser.jsx';
import LoginActionType from '../constants/actionType/Login.jsx';
import RoutePath from '../util/RoutePath.jsx';

let _currentUser = null,
  _error = null,
  _currentPrivilege = null;
let CURRENT_USER_EVENT = 'currentuser',
  PASSWORD_ERROR_EVENT = 'passworderror',
  PASSWORD_SUCCESS_EVENT = 'passwordsuccess',
  CURRENT_PRIVILEGE_EVENT = 'currentprivilege';

const PRIVILEGE_ADMIN_PERMISSION = ['1205', '1218', '1219', '1221', '1206', '1207', '1208', '1210', '1217', '1223', '1301'];

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
      _currentPrivilege = PRIVILEGE_ADMIN_PERMISSION;

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
      privilege = PRIVILEGE_ADMIN_PERMISSION;

    } else {
      userRoleList.forEach(role => {
        if (role.Id == user.UserType) {
          privilege = role.PrivilegeCodes;
        }
      });
    }
    return privilege;
  },
  getMainMenuItems: function() {
    var menuItems = [];
    if (!this.getCurrentPrivilege()) return

    if (this.getCurrentPrivilege().indexOf('1300') > -1 || this.getCurrentPrivilege().indexOf('1301') > -1) {
      menuItems.push(
        {
          getPath: RoutePath.kpi,
          title: I18N.MainMenu.KPI,
        }
      );
    }
    menuItems.push(
      {
        getPath: RoutePath.map,
        title: I18N.MainMenu.Map
      }
    );
    if (this.getCurrentPrivilege().indexOf('1221') > -1) {
      menuItems.push(
        {
          getPath: RoutePath.alarm,
          title: I18N.MainMenu.Alarm
        }
      );
    }
    menuItems.push(
      {
        getPath: RoutePath.setting,
        title: I18N.MainMenu.Energy
      }
    );
    
    if (this.getCurrentPrivilege().indexOf('1218') > -1 || this.getCurrentPrivilege().indexOf('1219') > -1) {
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
    if (this.getCurrentPrivilege().indexOf('1208') > -1 || this.getCurrentPrivilege().indexOf('1207') > -1 || this.getCurrentPrivilege().indexOf('1217') > -1) {
      var customerChildren = [];
      if (this.getCurrentPrivilege().indexOf('1208') > -1) {
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
      if (this.getCurrentPrivilege().indexOf('1207') > -1) {
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
      if (this.getCurrentPrivilege().indexOf('1217') > -1) {
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

    return menuItems;
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

var CurrentUserAction = CurrentUser.Action;

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
  }
});

module.exports = CurrentUserStore;
