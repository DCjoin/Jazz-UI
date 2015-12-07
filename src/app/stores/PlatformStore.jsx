'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import Platform from '../constants/actionType/Platform.jsx';
import CommonFuns from '../util/Util.jsx';

let searchTagList = [];
let interData = null;
let PlatformAction = Platform.Action;
/*
 if change checked state of the tags from the tag list,than it is true;
 when select item of alarm list, set it false in AlarmList.jsx
*/
let _providerList = [],
  _selectedProvider = null,
  _currentProvider = null;

const PROVIDER_LIST_EVENT = 'providerlist',
  SELECT_PROVIDER_EVENT = 'selectprovider';

var PlatformStore = assign({}, PrototypeStore, {

  setProviderList(list) {
    _providerList = list;
    if (list.length > 0) {
      _selectedProvider = list[0];
      _currentProvider = Immutable.fromJS(list[0]);
      this.emitSelectProviderChange();
    }
  },
  getProviderList() {
    return _providerList;
  },
  setSelectProvider(provider) {
    _selectedProvider = provider;
    if (provider === null) {
      _currentProvider = Immutable.fromJS({});
    } else {
      _currentProvider = Immutable.fromJS(provider);
    }

  },
  getSelectProvider() {
    if (_currentProvider === null) {
      return {};
    } else {
      return _currentProvider.toJS();
    }

  },
  mergeProvider: function(data) {
    if (data.path == 'StartDate') {
      var d2j = CommonFuns.DataConverter.DatetimeToJson;
      _currentProvider = _currentProvider.set(data.path, d2j(new Date(data.value)));
    } else {
      _currentProvider = _currentProvider.set(data.path, data.value);
    }

  },
  resetProvider: function() {
    _currentProvider = Immutable.fromJS(_selectedProvider);
  },
  modifyProvider: function(provider) {
    var flag = false;
    _providerList.forEach(item => {
      if (item.Id == provider.Id) {
        item = provider;
        flag = true;
      }
    });
    if (!flag) {
      _providerList.push(provider);
    }
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
  addSelectProviderChangeListener: function(callback) {
    this.on(SELECT_PROVIDER_EVENT, callback);
  },
  emitSelectProviderChange: function() {
    this.emit(SELECT_PROVIDER_EVENT);
  },
  removeSelectProviderChangeListener: function(callback) {
    this.removeListener(SELECT_PROVIDER_EVENT, callback);
  },
});
PlatformStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {

    case PlatformAction.GET_PROVIDER:
      PlatformStore.setProviderList(action.list);
      PlatformStore.emitProviderListChange();
      break;
    case PlatformAction.SET_SELECT_PROVIDER:
      PlatformStore.setSelectProvider(action.provider);
      PlatformStore.emitSelectProviderChange();
      break;
    case PlatformAction.MERGE_PROVIDER:
      PlatformStore.mergeProvider(action.data);
      PlatformStore.emitSelectProviderChange();
      break;
    case PlatformAction.CANCEL_SAVE:
      PlatformStore.resetProvider();
      PlatformStore.emitSelectProviderChange();
      break;
    case PlatformAction.MODIFY_SUCCESS:
      PlatformStore.modifyProvider(action.provider);
      PlatformStore.emitProviderListChange();
      break;

  }
});

module.exports = PlatformStore;
