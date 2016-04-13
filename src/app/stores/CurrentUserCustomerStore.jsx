/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import events from 'events';
import assign from 'object-assign';
import Util from '../util/util.jsx';
import PermissionCode from '../constants/PermissionCode.jsx';
//import LoginActionType from '../constants/actionType/Login.jsx';
import SelectCustomerActionType from '../constants/actionType/SelectCustomer.jsx';
//import UserActionType from '../constants/actionType/User.jsx';
import _includes from 'lodash/collection/includes';

var _ = { includes: _includes };
let {EventEmitter} = events;
//let UserAction = UserActionType.Action;
let CHANGE_EVENT = 'change';
let USER_IFNO_CHANGE_EVENT = 'user_ifno_change_event';
let _customers = null;
let _currentCustomer = null;
let _currentUser = null;
let _isSpAdmin = false;

function reset() {
  _customers = null;
  _currentCustomer = null;
  _currentUser = null;
  _isSpAdmin = false;
}

function checkSpAdmin(customer) {
  if (customer.CustomerId === -1) {
    _currentCustomer = null;
    _isSpAdmin = true;
  } else {
    _isSpAdmin = false;
  }
}

let CurrentUserCustomerStore = assign({}, EventEmitter.prototype, {
  checkHasSpAdmin: function() {
    if (_currentUser.UserType === -1 || Util.checkHasPermissionByCode(PermissionCode.SP_CUSTOMER_MANAGE.READONLY, _currentUser.PrivilegeCodes) || Util.checkHasPermissionByCode(PermissionCode.SP_USER_MANAGE.READONLY, _currentUser.PrivilegeCodes) || Util.checkHasPermissionByCode(PermissionCode.SP_DEVICE_TEMPLATE_MANAGE.READONLY, _currentUser.PrivilegeCodes) || Util.checkHasPermissionByCode(PermissionCode.SP_PARAMETER_TEMPLATE_MANAGE.READONLY, _currentUser.PrivilegeCodes)) {
      return true;
    }

    return false;
  },
  setCustomer: function(customer) {
    //console.log('here***********************' + JSON.stringify(customer));
    _currentCustomer = assign({}, _currentCustomer, customer);
    checkSpAdmin(_currentCustomer);
  },
  init: function(data) {
    _customers = data;
    // _currentUser = data;
    // if (_customers.length + this.checkHasSpAdmin() === 1) {
    //   this.setCustomer(this.checkHasSpAdmin() ? { CustomerId: -1 } : _customers[0]);
    // }
    // if (data.defaultCustomerCode) {
    //   this.setCustomer(this.getCustomerById(data.defaultCustomerCode));
    // }
  },
  //To determine the permission by given code for current user
  permit: function(code) {
    if (!_currentUser || !_currentUser.PrivilegeCodes || _currentUser.PrivilegeCodes.length === 0) {
      return false;
    }

    return _.includes(_currentUser.PrivilegeCodes, code + "");

  },
  getAll: function() {
    return _customers;
  },
  getCurrentCustomer: function() {
    return _currentCustomer;
  },
  getCurrentCustomerId: function() {
    if (_currentCustomer) {
      return _currentCustomer.CustomerId;
    } else {
      return null;
    }
  },
  getCurrentUser: function(argument) {
    return _currentUser;
  },
  getCurrentUserId() {
    return _currentUser.Id;
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  addUserInfoChangeListener: function(callback) {
    this.on(USER_IFNO_CHANGE_EVENT, callback);
  },
  removeUserInfoChangeListener: function(callback) {
    this.removeListener(USER_IFNO_CHANGE_EVENT, callback);
  },
  getCustomerByCode: function(code) {
    var arr = _customers.filter((item) => item.CustomerName === code);
    if (arr.length === 1) {
      return arr[0];
    }
    if (arr.length > 1) {
      console.log('has same code customer, return first one');
      return arr[0];
    }

    return null;
  },
  getCustomerById: function(id) {
    var customers = _customers.filter((item) => item.CustomerId == id);
    if (customers.length === 0)
      return null;
    if (customers.length > 1) {
      console.log('has same id customer,return first one');
    }

    return customers[0];

  },
  updateUserFromProfile(data) {
    _currentUser.RealName = data.RealName;
    _currentUser.Telephone = data.Telephone;
    _currentUser.Email = data.Email;
    _currentUser.Title = data.Title;
    _currentUser.Version = data.Version;
  },
  isSpAdmin: function() {
    return _isSpAdmin;
  },
  empty: function(argument) {
    reset();
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  emitUserInfoChange: function() {
    this.emit(USER_IFNO_CHANGE_EVENT);
  },

  dispatcherIndex: AppDispatcher.register(function(action) {
    switch (action.type) {
      case SelectCustomerActionType.Action.GET_SELECT_CUSTOMERS:
        CurrentUserCustomerStore.init(action.data);
        CurrentUserCustomerStore.emitChange();
        break;
      case SelectCustomerActionType.Action.SELECT_ACCOUNT_SUCCESS:
        CurrentUserCustomerStore.setCustomer(action.data);
        CurrentUserCustomerStore.emitChange();
        break;
      default: // do nothing
    }
  })

});

module.exports = CurrentUserCustomerStore;
