import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import CurrentUser from '../constants/actionType/CurrentUser.jsx';

let _currentUser = null,
  _error = null;
let CURRENT_USER_EVENT = 'currentuser',
  PASSWORD_ERROR_EVENT = 'passworderror',
  PASSWORD_SUCCESS_EVENT = 'passwordsuccess';

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
  setPasswordSuccess: function() {
    _error = null;
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
      CurrentUserStore.emitPasswordErrorChange();
      break;
  }
});

module.exports = CurrentUserStore;
