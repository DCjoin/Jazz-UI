'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import TB from '../constants/actionType/TB.jsx';

var _tb = null;

var TBStore = assign({},PrototypeStore,{
  getData(){
    return _tb;
  },
  setData(tb){
    _tb = tb;
  }
});

var Action = TB.Action;

TBStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.LOAD_TB:
           TBStore.setData(action.tbs);
           TBStore.emitChange();
        break;
      case Action.SAVE_TB:
           TBStore.setData(action.tbs);
           TBStore.emitChange();
        break;

    }
});

module.exports = TBStore;
