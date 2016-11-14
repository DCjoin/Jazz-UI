/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import events from 'events';
import assign from 'object-assign';
import SelectCustomer from '../constants/actionType/SelectCustomer.jsx';
import CurrentUser from '../constants/actionType/CurrentUser.jsx';
import LoginActionType from '../constants/actionType/Login.jsx';
import CurrentUserStore from './CurrentUserStore.jsx';

let {EventEmitter} = events;
let CHANGE_EVENT = 'change';
let _customers = null;
let _currentCustomer = null;
let _currentUser = null;

let CurrentUserCustomerStore = assign({}, EventEmitter.prototype, {
  setCustomer: function(customer) {
    _currentCustomer = assign({}, _currentCustomer, customer);
  },
  init: function(data) {
    _customers = data;
  },
  getAll: function() {
    return _customers;
  },
  getCurrentCustomer: function() {
    return _currentCustomer;
  },
  getCurrentUser: function(argument) {
    return _currentUser;
  },
  ifEmitCustomerrChange: function() {
    var that = this;
    var currentPrivilege = CurrentUserStore.getCurrentPrivilege();
    if (currentPrivilege !== null && _customers !== null) {
      that.emitChange();
    }
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    _currentCustomer = '';
    // _customers = null;
    // _currentUser = null;
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
});

var currentUserAction = CurrentUser.Action,
  selectCustomerAction = SelectCustomer.Action;
CurrentUserCustomerStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case selectCustomerAction.GET_SELECT_CUSTOMERS:
      CurrentUserCustomerStore.init(action.data);
      // CurrentUserCustomerStore.ifEmitCustomerrChange();
      CurrentUserCustomerStore.emitChange();
      break;
    // case currentUserAction.GET_ROLE:
    //   CurrentUserCustomerStore.ifEmitCustomerrChange();
    //   break;
    case selectCustomerAction.SELECT_ACCOUNT_SUCCESS:
      CurrentUserCustomerStore.setCustomer(action.data);
      CurrentUserCustomerStore.emitChange();
      break;
    case LoginActionType.Action.LOGOUT:
      _customers = null;
      _currentCustomer = null;
      _currentUser = null;
      break;
    default: // do nothing
  }
});

module.exports = CurrentUserCustomerStore;
