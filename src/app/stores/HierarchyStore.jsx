import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
let HIERARCHY_NODE_EVENT = 'checkallstatus';
let NODE_LOADING_EVENT= 'nodeloading';
var _data = {};
var _isLoading=false;

var HierarchyStore = assign({},PrototypeStore,{
  getData(){
    return _data;
  },
  setData(data){
    _data =  data;
    _isLoading=false;
  },
  setNodeLoading(){
    _isLoading=true;
  },
  getNodeLoading(){
    return _isLoading;
  },
  findHierItem(item, hierId){

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
  },
  emitNodeLoadingChange: function() {
        this.emit(NODE_LOADING_EVENT);
        },

  addNodeLoadingListener: function(callback) {
       this.on(NODE_LOADING_EVENT, callback);
        },

  removeNodeLoadingListener: function(callback) {
      this.removeListener(NODE_LOADING_EVENT, callback);
      this.dispose();
        },
  emitHierarchyNodeChange: function() {
              this.emit(HIERARCHY_NODE_EVENT);
              },
  addHierarchyNodeListener: function(callback) {
             this.on(HIERARCHY_NODE_EVENT, callback);
              },

  removeHierarchyNodeListener: function(callback) {
            this.removeListener(HIERARCHY_NODE_EVENT, callback);
            this.dispose();
              },
});
var Action = Hierarchy.Action;
HierarchyStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
      case Action.LOAD_HIE_NODE:
           HierarchyStore.setData(action.hierarchyList);
           HierarchyStore.emitHierarchyNodeChange();
        break;
      case Action.SET_HIE_NODE_LOAGDING:
           HierarchyStore.setNodeLoading();
           HierarchyStore.emitNodeLoadingChange();
        break;

    }
});

module.exports = HierarchyStore;
