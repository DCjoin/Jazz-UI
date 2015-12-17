import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import CurrentUser from '../constants/actionType/CurrentUser.jsx';

let _currentUser = null,
  _error = null,
  _currentPrivilege = null;
let CURRENT_USER_EVENT = 'currentuser',
  PASSWORD_ERROR_EVENT = 'passworderror',
  PASSWORD_SUCCESS_EVENT = 'passwordsuccess',
  CURRENT_PRIVILEGE_EVENT = 'currentprivilege';

var CurrentUserStore = assign({}, PrototypeStore, {

  setCurrentUser: function(userInfo) {
    _currentUser = userInfo;
  },
  getCurrentUser: function() {
    return _currentUser;
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
      I18N.Privilege.Common.DashboardView,
      I18N.Privilege.Common.DashboardManagement,
      I18N.Privilege.Common.PersonalInfoManagement,
      I18N.Privilege.Common.MapView
    ]);
  },
  getRolePrivilegeList: function() {
    var array = [],
      role = [];

    role = [I18N.Privilege.Role.DashboardSharing,
      I18N.Privilege.Role.EnergyUsage,
      I18N.Privilege.Role.CarbonEmission,
      I18N.Privilege.Role.EnergyCost,
      '',
      I18N.Privilege.Role.EnergyExport,
      I18N.Privilege.Role.SPManagement,
      I18N.Privilege.Role.HierarchyManagement,
      I18N.Privilege.Role.TagManagement,
      '',
      I18N.Privilege.Role.TagMapping,
      I18N.Privilege.Role.CustomerInfoView,
      I18N.Privilege.Role.CustomerInfoManagement,
      I18N.Privilege.Role.UnitIndicator,
      I18N.Privilege.Role.RatioIndicator,
      I18N.Privilege.Role.CorporateRanking,
      I18N.Privilege.Role.LabelingIndicator,
      I18N.Privilege.Role.CustomLabeling,
      I18N.Privilege.Role.ReportView,
      I18N.Privilege.Role.ReportManagement,
      I18N.Privilege.Role.ChartRemarking,
      I18N.Privilege.Role.EnergyAlarm,
    ];
    role.forEach((item, index) => {
      array[1200 + index] = item;
    });
    return array;
  },
  setPasswordSuccess: function() {
    _error = null;
  },
  setCurrentPrivilege: function(role, useId) {
    if (useId == 100001 || useId == 1) {
      _currentPrivilege = [];
      for (var i = 1200; i <= 1221; i++) {
        var index = i + '';
        _currentPrivilege.push(index);
      }
    } else {
      _currentPrivilege = role.PrivilegeCodes;
    }


  },
  getCurrentPrivilege: function() {
    return _currentPrivilege;
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
      CurrentUserStore.setPasswordSuccess();
      CurrentUserStore.emitPasswordSuccessChange();
      break;
    case CurrentUserAction.GET_ROLE:
      CurrentUserStore.setCurrentPrivilege(action.role, action.userId);
      CurrentUserStore.emitCurrentrivilegeChange();
      break;
  }
});

module.exports = CurrentUserStore;
