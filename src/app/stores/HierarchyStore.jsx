import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
var _data = {};

var HierarchyStore = assign({},PrototypeStore,{
  getData(){
    console.log("**wyh**HierarchyStore_getData");
    console.log(_data);
    return _data;
  },
  setData(data){
    console.log("**wyh**HierarchyStore_setData");
    console.log(data);
    _data =  data;
  },
  findHierItem(item, hierId){
    console.log("**wyh**HierarchyStore_gfindHierItem");

    if(item.Id === hierId){
      return item;
    }

    if(item.Children){
      for(let i=0,len=item.Children.length; i<len; i++){
        let resultItem = HierarchyStore.findHierItem(item.Children[i], hierId);
        if(resultItem){
          return resultItem;
        }
      }
    }

    return null;
  }
});
var Action = Hierarchy.Action;
HierarchyStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
      case Action.LOAD_HIE_NODE:
           HierarchyStore.setData(action.hierarchyList);
           HierarchyStore.emitChange();
        break;

    }
});

module.exports = HierarchyStore;
