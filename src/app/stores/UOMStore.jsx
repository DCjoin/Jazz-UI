'use strict';

import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import {find} from 'lodash-es';
import {Action} from '../constants/actionType/Main.jsx';

let _uoms = null;
var UOMStore = assign({},PrototypeStore,{
  initUoms(uoms){
    _uoms = uoms;
  },
  getUoms(){
    return _uoms; 
  },
  getUomById(id) {
    let code = find(UOMStore.getUoms(), uom => uom.Id === id).Code;
    if( code === 'null' ) {
      return '';
    }
    return code;
  }
});

UOMStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_ALL_UOMS_SUCCESS:
        UOMStore.initUoms(action.uoms);
        UOMStore.emitChange();
        break;
      case Action.GET_ALL_UOMS_ERROR:
        UOMStore.initUoms([]);
        UOMStore.emitChange();
        break;
    }
});

module.exports = UOMStore;
