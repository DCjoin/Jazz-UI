/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import events from 'events';
import assign from 'object-assign';
import CookieUtil from '../util/cookieUtil.jsx';
import LoginActionType from '../constants/actionType/Login.jsx';
import { getCookie } from '../util/Util.jsx';
import CurrentUserStore from '../stores/CurrentUserStore.jsx';
import PermissionCode from '../constants/PermissionCode.jsx';

let { EventEmitter } = events;

let CHANGE_EVENT = 'change';
let CHANGE_TRIAL_EVENT = 'change_trial_event';

let _currentUserId = null;
let _currentUser = null;
let _lastError = null;
let _reqPSWReset = null;
let _reqTrialUseReset = null;

let LoginStore = assign({}, EventEmitter.prototype, {
  checkHasSpAdmin: function() {
    if (CurrentUserStore.getCurrentUser().UserType === -1 || (CurrentUserStore.permit(PermissionCode.PLATFORM_MANAGEMENT.FULL) )) {
      if( !CurrentUserStore.getSpPrivilege() || CurrentUserStore.getSpPrivilege().length === 0 ) {
        return false;
      }
      return true;
    }
    return false;
  },
  init: function(data, success, expiresDate) {
    if (success) {
      _lastError = null;
      CookieUtil.set('UserId', data.Id, {
        expires: expiresDate || 1
      });
      if( data.Token ) {
        CookieUtil.set('AuthLoginToken', data.Token, {
          expires: expiresDate || 1
        });
      }
      CookieUtil.set('SkipLogin', 'true',{
        expires: expiresDate || 1
      });

      window.currentUserId = data.Id;
      window.currentUser = data;
      _currentUser = data;
      return _currentUser;
    } else {
      this.empty();
      _lastError = data;
    }
  },
  reqPSWReset:function(data, success){
    if(success){
      _reqPSWReset = true;
    }else {
      _reqPSWReset = false;
    }
    return _reqPSWReset;
  },
  getreqPSWReset: function(argument) {
    return _reqPSWReset;
  },
  reqTrialUseReset:function(data, success){
    if(success){
      _reqTrialUseReset = true;
    }else {
      _reqTrialUseReset = false;
    }
    return _reqTrialUseReset;
  },
  getreqTrialUseReset: function(argument) {
    return _reqTrialUseReset;
  },
  hasLoggedin: function(argument) {
    if (CookieUtil.get('SkipLogin')) {
      return true;
    }
    return false;
  },
  getAuthLoginToken: function() {
    return CookieUtil.get('AuthLoginToken');
  },
  hasAuthLoginToken: function() {
    if (CookieUtil.get('AuthLoginToken')) {
      return true;
    }
    return false;
  },
  getCurrentUserId: function() {
    return CookieUtil.get('UserId');
  },
  getCurrentUser: function(argument) {
    return _currentUser;
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange: function(arg) {
    this.emit(arg || CHANGE_EVENT);
  },
  addTrialListener: function(callback) {
    this.on(CHANGE_TRIAL_EVENT, callback);
  },
  removeTrialListener: function(callback) {
    this.removeListener(CHANGE_TRIAL_EVENT, callback);
  },
  emitTrialChange: function(arg) {
    this.emit(arg || CHANGE_TRIAL_EVENT);
  },
  empty: function() {
    CookieUtil.set('UserId', null, {
      expires: -1
    });
    CookieUtil.set('AuthLoginToken', null, {
      expires: -1
    });
    CookieUtil.set('SkipLogin', null, {
      expires: -1
    });
    CookieUtil.set('AssertId', null, {
      expires: -1
    });
  },
  getLastError: function(argument) {
    return _lastError;
  },
	receiveAuthCode: function (data, success) {
		if(success){
			_receiveAuthCode = true;
		} else {
			_lastError = data;
			_receiveAuthCode = false;
		}
	},
	resetReceiveAuthCode: function () {
		_receiveAuthCode = false;
	},
});

LoginStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case LoginActionType.Action.LOGIN_SUCCESS:
      LoginStore.init(action.data, true, action.expiresDate);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.LOGIN_ERROR:
      LoginStore.init(action.data, false);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.LOGOUT:
      LoginStore.empty();
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.GET_AUTH_CODE_SUCCESS:
      LoginStore.receiveAuthCode(action.data, true);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.GET_AUTH_CODE_ERROR:
      LoginStore.receiveAuthCode(action.data, false);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.RESET_AUTH_CODE_STATUE:
      LoginStore.resetReceiveAuthCode();
      break;
    case LoginActionType.Action.REQ_PSWRESET_SUCCESS:
      LoginStore.reqPSWReset(action.data, true);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.REQ_PSWRESET_ERROR:
      LoginStore.reqPSWReset(action.data, false);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.REQ_DEMO_APPLY_SUCCESS :
      LoginStore.reqTrialUseReset(action.data, true);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.REQ_DEMO_APPLY_ERROR :
      LoginStore.reqTrialUseReset(action.data, false);
      LoginStore.emitChange();
      break;
    case LoginActionType.Action.TRIAL_SUCCESS :
      LoginStore.emitTrialChange();
      break;
    default:
      // do nothing
  }
});

module.exports = LoginStore;
