'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Setting.jsx';


const SETTING_DATA_CHANGED_EVENT = 'modifydatachanged';
var _baselineModifyData = {};

var BaselineModifyStore = assign({},PrototypeStore,{
  getData(){
    return _baselineModifyData;
  },
  setData(data){
    _baselineModifyData =  data;
  },
  addSettingDataListener: function(callback) {
    this.on(SETTING_DATA_CHANGED_EVENT, callback);
  },
  emitSettingData: function() {
    this.emit(SETTING_DATA_CHANGED_EVENT);
  },
  removeSettingDataListener: function(callback) {
    this.removeListener(SETTING_DATA_CHANGED_EVENT, callback);
  },
});
BaselineModifyStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GET_MODIFY_DATA:
      BaselineModifyStore.setData(action.modifyData);
      BaselineModifyStore.emitSettingData();
      break;
    case Action.SET_MODIFY_DATA_SUCCESS:
      break;
    case Action.SET_MODIFY_DATA_ERROR:
      break;
  }
});

module.exports = BaselineModifyStore;
