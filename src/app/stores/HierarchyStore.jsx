import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
var _data = {};

var HierarchyStore = assign({},PrototypeStore,{
  getDate(){
    return _data;
  },
  setDate(data){

      _data =  data;


  },
});
var Action = Hierarchy.Action;
HierarchyStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
      case Action.LOAD_HIE_NODE:
           HierarchyStore.setDate(action.hierarchyList);
           HierarchyStore.emitChange();
        break;

    }
});

module.exports = HierarchyStore;
