'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Setting.jsx';


const SETTING_DATA_CHANGED_EVENT = 'seetingdatachanged';
var _alarmSettingData = {};

var AlarmSettingStore = assign({},PrototypeStore,{
  getData(){
    return _alarmSettingData;
  },
  setData(data){
    _alarmSettingData =  data;
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
AlarmSettingStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.LOAD_SETTING_DATA:
      AlarmSettingStore.setData(action.alarmSettingData);
      AlarmSettingStore.emitSettingData();
      break;
    case Action.SAVE_SETTING_SUCCESS:
      break;
    case Action.SAVE_SETTING_ERROR:
      break;
  }
});

module.exports = AlarmSettingStore;
