'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/Setting.jsx';


const DATA_CHANGED_EVENT = 'datachanged';
var _alarmSettingData = {};

var AlarmSettingStore = assign({},PrototypeStore,{
  getData(){
    return _alarmSettingData;
  },
  setData(data){
    _alarmSettingData =  data;
  },
  addSettingDataListener: function(callback) {
    this.on(DATA_CHANGED_EVENT, callback);
  },
  emitSettingData: function() {
    this.emit(DATA_CHANGED_EVENT);
  },
  removeSettingDataListener: function(callback) {
    this.removeListener(DATA_CHANGED_EVENT, callback);
  },
});
AlarmSettingStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.GET_ALARM_DATA_SUCCESS:
      AlarmSettingStore.setData(action.alarmSettingData);
      AlarmSettingStore.emitSettingData();
      break;
    case Action.GET_ALARM_DATA_ERROR:
      break;
    case Action.SET_ALARM_DATA_SUCCESS:
      AlarmSettingStore.setData(action.alarmSettingData);
      AlarmSettingStore.emitSettingData();
      break;
    case Action.SET_ALARM_DATA_ERROR:
      break;
  }
});

module.exports = AlarmSettingStore;
