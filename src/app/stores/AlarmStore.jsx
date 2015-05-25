'use strict';


import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';
import {Action} from '../constants/actionType/Alarm.jsx';

var _dateType = dateType.DAY_ALARM;
var _dateValue = null;
var _hierarchyList = null;

var AlarmStore = assign({},PrototypeStore,{
  getDateType(){
    return _dateType;
  },
  setDateType(type){
    _dateType = type;
  },
  onDateTypeChanged(type){
    _dateType = type;
    _dateValue = null;
    _hierarchyList = null;
  },
  getDateValue(){
    return _dateValue;
  },
  getHierarchyList(){
    return _hierarchyList;
  }

});

AlarmStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.DATETYPE_CHANGED:
      AlarmStore.onDateTypeChanged(action.dateType);
      AlarmStore.emitChange();
      break;
    }
});

module.exports = AlarmStore;
