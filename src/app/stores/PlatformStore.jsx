'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Platform from '../constants/actionType/Platform.jsx';

let searchTagList = [];
let interData = null;
let PlatformAction = Platform.Action;
/*
 if change checked state of the tags from the tag list,than it is true;
 when select item of alarm list, set it false in AlarmList.jsx
*/
let _providerList = null;

const PROVIDER_LIST_EVENT = 'providerlist';

var PlatformStore = assign({}, PrototypeStore, {

  setProviderList(list) {
    _providerList = list;
  },
  getProviderList() {
    return _providerList;
  },
  addProviderListChangeListener: function(callback) {
    this.on(PROVIDER_LIST_EVENT, callback);
  },
  emitProviderListChange: function() {
    this.emit(PROVIDER_LIST_EVENT);
  },
  removeProviderListChangeListener: function(callback) {
    this.removeListener(PROVIDER_LIST_EVENT, callback);
  },
});
PlatformStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {

    case PlatformAction.GET_PROVIDER:
      PlatformStore.setProviderList(action.list);
      PlatformStore.emitProviderListChange();
      break;
  }
});

module.exports = PlatformStore;
