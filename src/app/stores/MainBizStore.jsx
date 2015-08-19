'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {Action} from '../constants/actionType/MainBiz.jsx';

let bizType=['folder','energy','unit','radio','labelling','ranking']
let _bizType=null; //folder,energy,unit,radio,labelling,ranking
let SET_BIZ_TYPE_EVENT='setbiztype';

var MainBizStore = assign({},PrototypeStore,{
  setBizType:function(typeId){
    _bizType=bizType[typeId];
  },
  getBizType:function(){
    return _bizType;
  },
  addBizTypeListener: function(callback) {
    this.on(SET_BIZ_TYPE_EVENT, callback);
  },
  emitBizTypeListener:function() {
    this.emit(SET_BIZ_TYPE_EVENT);
  },
  removeBizTypeListener:function(callback) {
    this.removeListener(SET_BIZ_TYPE_EVENT, callback);
  }

});

MainBizStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.SET_BIZ_TYPE:
        MainBizStore.setBizType(action.typeId);
        MainBizStore.emitBizTypeListener();
        break;

    }
});

module.exports = MainBizStore;
