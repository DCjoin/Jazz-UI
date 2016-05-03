/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import events from 'events';
import assign from 'object-assign';
import CookieUtil from '../util/cookieUtil.jsx';
import LoginActionType from '../constants/actionType/Login.jsx';
import { getCookie } from '../util/Util.jsx';

let { EventEmitter } = events;

let CHANGE_EVENT = 'change';

let _currentUserId = null;
let _currentUser = null;
let _lastError = null;

let LoginStore = assign({}, EventEmitter.prototype, {
  checkHasSpAdmin: function() {
    //console.log('1111111'+JSON.stringify(_currentUser,0,1));
    if (_currentUser.UserType === -1) {
      return true;
    }
    return false;
  },
  init: function(data, success) {
    if (success) {
      _lastError = null;
      //, {'expires':5,'path':'/'}
      //CookieUtil.set('UserInfo', JSON.stringify(data));
      CookieUtil.set('UserId', data.Id);
      CookieUtil.set('Username', data.Name);

      window.currentUserId = data.Id;
      window.currentUser = data;
      _currentUser = data;
      return _currentUser;
    } else {
      this.empty();
      _lastError = data;
    }
  },
  hasLoggedin: function(argument) {
    if (CookieUtil.get('UserId')) {
      return true;
    }
    return false;
  },
  getCurrentUserId: function(argument) {
    if (!_currentUserId) {
      _currentUserId = CookieUtil.get('UserId');
    }
    return _currentUserId;
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
  empty: function() {
    CookieUtil.set('UserId', null);
    CookieUtil.set('Username', null);
    CookieUtil.set('currentCustomerId', null);
    window.currentUserId = null;
    window.currentUser = null;
    window.currentCustomerId = null;
  },
  getLastError: function(argument) {
    return _lastError;
  },
  emitChange: function(arg) {
    this.emit(arg || CHANGE_EVENT);
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
      LoginStore.init(action.data, true);
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
    default:
      // do nothing
  }
});

module.exports = LoginStore;
