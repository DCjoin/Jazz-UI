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
  _currentProvider = null,
  _column = null,
  _sort = null,
  _error = null;

const PROVIDER_LIST_EVENT = 'providerlist',
  SELECT_PROVIDER_EVENT = 'selectprovider',
  ERROR_EVENT = 'error',
  SEND_EMAIL_EVENT = 'sendemail';

var PlatformStore = assign({}, PrototypeStore, {

  setProviderList(list) {
    _providerList = list;
    if (list.length > 0) {
      if (_selectedProvider === null) {
        _selectedProvider = list[0];
        _currentProvider = Immutable.fromJS(list[0]);
        this.emitSelectProviderChange();
      } else {
        _providerList.forEach(item => {
          if (item.Id == _selectedProvider.Id) {
            _selectedProvider = item;
            _currentProvider = Immutable.fromJS(_selectedProvider);
          }
        });
      }
    }
  },
  getProviderList() {
    return _providerList;
  },
  setSelectProvider(provider) {
    //_currentProvider = Immutable.fromJS(provider);
    if (provider === null) {
      _currentProvider = Immutable.fromJS({
        CalcStatus: true,
        Status: 1
      });
    } else {
      _currentProvider = Immutable.fromJS(provider);
      _selectedProvider = provider;
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
    if (data.path == 'UserName' && _error !== null) {
      _error = null;
      this.emitErrorChange();
    }

  },
  resetProvider: function() {
    _currentProvider = Immutable.fromJS(_selectedProvider);
  },
  modifyProvider: function(provider) {
    var index;
    _providerList.forEach((item, i) => {
      if (item.Id == provider.Id) {
        index = i;
      }
    });
    _providerList[index] = provider;
    this.setSelectProvider(provider);
    this.emitSelectProviderChange();


  },
  setError: function(res) {
    var errorCode = eval("(" + res + ")");
    _error = errorCode.error.Code;
  },
  getError: function() {
    return _error;
  },
  deleteProvider: function(dto) {
    _providerList.forEach((item, index) => {
      if (item.Id == dto.Id) {
        if (index == _providerList.length - 1) {
          _selectedProvider = _providerList[index - 1];
          _currentProvider = Immutable.fromJS(_selectedProvider);
        } else {
          _selectedProvider = _providerList[index + 1];
          _currentProvider = Immutable.fromJS(_selectedProvider);
        }

      }
    });
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
  addErrorChangeListener: function(callback) {
    this.on(ERROR_EVENT, callback);
  },
  emitErrorChange: function() {
    this.emit(ERROR_EVENT);
  },
  removeErrorListener: function(callback) {
    this.removeListener(ERROR_EVENT, callback);
  },
  addSendEmailListener: function(callback) {
    this.on(SEND_EMAIL_EVENT, callback);
  },
  emitSendEmailChange: function() {
    this.emit(SEND_EMAIL_EVENT);
  },
  removeSendEmailListener: function(callback) {
    this.removeListener(SEND_EMAIL_EVENT, callback);
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
      PlatformStore.emitProviderListChange();
      break;
    case PlatformAction.MODIFY_SUCCESS:
      PlatformStore.modifyProvider(action.provider);
      PlatformStore.emitProviderListChange();
      break;
    case PlatformAction.CREATE_SUCCESS:
      PlatformStore.setSelectProvider(action.item);
      break;
    case PlatformAction.MODIFY_ERROR:
      PlatformStore.setError(action.res.text);
      PlatformStore.emitErrorChange();
      break;
    case PlatformAction.DELETE_SUCCESS:
      PlatformStore.deleteProvider(action.dto);
      break;
    case PlatformAction.SEND_EMAIL_SUCCESS:
      PlatformStore.emitSendEmailChange();
      break;

  }
});

module.exports = PlatformStore;
