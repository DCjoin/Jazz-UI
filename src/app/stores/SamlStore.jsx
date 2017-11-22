/*jshint esversion: 6 */
'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import events from 'events';
import assign from 'object-assign';
import SamlActionType from '../constants/actionType/Saml.jsx';

let { EventEmitter } = events;
let CHANGE_EVENT = 'change';
let _acs = null;

let SamlStore = assign({}, EventEmitter.prototype, {
  getAcs: function() {
    return _acs;
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChange(args) {
    this.emit(CHANGE_EVENT, args);
  },

});

SamlStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case SamlActionType.Action.GET_ACS_SUCCESS:
      _acs = action.data.SAMLResponse;
      SamlStore.emitChange();
      break;
    default:
      // do nothing
  }
});

module.exports = SamlStore;
