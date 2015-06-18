'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import TBSetting from '../constants/actionType/TBSetting.jsx';

var _tbSetting = null;
var _calcData = null;

let CHANGE_TAG_EVENT = 'changetag';
let CHANGE_TBYEAR_EVENT = 'changetbyear';

var TBSettingStore = assign({},PrototypeStore,{
  getData(){
    return _tbSetting;
  },
  setData(data){
    _tbSetting = data;
  }
});

var Action = TBSetting.Action;
TBSettingStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case Action.LOADED_TBSETTING:
      TBSettingStore.setData(action.setting);
      TBSettingStore.emitChange();
      break;
    case Action.SAVE_TBSETTING:
      TBSettingStore.setData(action.setting);
      TBSettingStore.emitChange();
      break;
  }
});

module.exports = TBSettingStore;
