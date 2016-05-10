/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import events from 'events';
import assign from 'object-assign';
import SelectCustomerActionType from '../constants/actionType/SelectCustomer.jsx';

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

CurrentUserCustomerStore.dispatchToken = AppDispatcher.register(function(action) {
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
});

module.exports = CurrentUserCustomerStore;
