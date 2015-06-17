'use strict';


import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Alarm.jsx';

let _hierarchyList = null;

let CHANGE_ALAMLIST_EVENT = 'changealarmlist';
var AlarmStore = assign({},PrototypeStore,{

  getHierarchyList(){
    return _hierarchyList;
  },
  convertAlarmList(alarmList){
    if(!alarmList || alarmList.length===0){
      _hierarchyList = null;
    }else{
      _hierarchyList = alarmList;
    }
  },
  emitAlarmlistChange: function() {
    this.emit(CHANGE_ALAMLIST_EVENT);
  },
  /**
   * @param {function} callback
   */
  addAlarmlistChangeListener: function(callback) {
    this.on(CHANGE_ALAMLIST_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeAlarmlistChangeListener: function(callback) {
    this.removeListener(CHANGE_ALAMLIST_EVENT, callback);
    this.dispose();
  },
});

AlarmStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.DATALIST_CHANGED:
        AlarmStore.convertAlarmList(action.alarmList);
        AlarmStore.emitAlarmlistChange();
        break;
      case Action.GET_HIERARCHY_LIST_ERROR:
        AlarmStore.convertAlarmList([]);
        AlarmStore.emitAlarmlistChange();
        break;
    }
});

module.exports = AlarmStore;
