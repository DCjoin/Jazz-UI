import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Tag from '../constants/actionType/Tag.jsx';

let LOAD_TAG_NODE_EVENT = 'loadtagnode';
let LOAD_ALARM_TAG_NODE_EVENT = 'loadalarmtagnode';
var _data = {};
var _totalTagStatus=[];
var _hierId=null;


var TagStore = assign({},PrototypeStore,{
  setTagStatusByHierarchyId:function(hierId,tagStatus){
    _totalTagStatus.push({
      hierId:hierId,
      tagStatus:tagStatus
    })
  },
  getTagStatusByHierarchyId:function(hierId){
    var tagStatus=null;
    _totalTagStatus.forEach(function(status,i){
      if(status.hierId==hierId){
        tagStatus=status.tagStatus
      }
    });
    return tagStatus;
  },
  setCurrentHierarchyId:function(hierId){
    _hierId=hierId;
  },
  getCurrentHierarchyId:function(hierId){
    return _hierId;
  },
  getData(){
    return _data;
  },
  setData(data){
      _data =  data;
      },
  emitTagNodeChange: function() {
        this.emit(LOAD_TAG_NODE_EVENT);
      },

  addTagNodeListener: function(callback) {
        this.on(LOAD_TAG_NODE_EVENT, callback);
      },

  removeTagNodeListener: function(callback) {
        this.removeListener(LOAD_TAG_NODE_EVENT, callback);
        this.dispose();
      },
  emitAlarmTagNodeChange: function() {
            this.emit(LOAD_ALARM_TAG_NODE_EVENT);
          },

  addAlarmTagNodeListener: function(callback) {
            this.on(LOAD_ALARM_TAG_NODE_EVENT, callback);
          },

  removeAlarmTagNodeListener: function(callback) {
            this.removeListener(LOAD_ALARM_TAG_NODE_EVENT, callback);
            this.dispose();
          },
});
var Action = Tag.Action;
TagStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
      case Action.LOAD_TAG_NODE:
           TagStore.setData(action.tagList);
           TagStore.emitTagNodeChange();
        break;
      case Action.LOAD_ALARM_TAG_NODE:
             TagStore.setData(action.tagList);
             TagStore.emitAlarmTagNodeChange();
        break;
      case Action.SET_TAGSTATUS:
            TagStore.setTagStatusByHierarchyId(action.hierId,action.tagStatus);
        break;
      case Action.SET_HIERARCHYID:
            TagStore.setCurrentHierarchyId(action.hierId);
        break;

    }
});

module.exports = TagStore;
