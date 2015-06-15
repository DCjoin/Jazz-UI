'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import {Action} from '../constants/actionType/AlarmTag.jsx';

let searchTagList=[];
let interData=null;

const INTER_DATA_CHANGED_EVENT = 'interdatachanged';

var AlarmTagStore = assign({},PrototypeStore,{

  getSearchTagList(){
    return searchTagList;
  },
  addSearchTagList(tagNode){
    var flag=false;

    searchTagList.forEach(function(nodeData,i){

      if(tagNode.tagId==nodeData.tagId){
        flag=true;
      }
    });
      if(!flag){
        searchTagList.push(tagNode);
      }

    },
  removeSearchTagList(tagNode){
    searchTagList.forEach(function(nodeData,i){
    if(tagNode.tagId==nodeData.tagId){

      searchTagList.splice(i,1);

    }
    });

  },
  clearSearchTagList(){
    searchTagList.length=0;
  },
  getInterData(){
    return interData;
  },
  setInterData(iaData){
    interData=iaData;
  },
  addInterDataListener: function(callback) {
    this.on(INTER_DATA_CHANGED_EVENT, callback);
  },
  emitInterData: function() {
    this.emit(INTER_DATA_CHANGED_EVENT);
  },
  removeInterDataListener: function(callback) {
    this.removeListener(INTER_DATA_CHANGED_EVENT, callback);
  },
});
AlarmTagStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.ADD_SEARCH_TAGLIST_CHANGED:
        AlarmTagStore.addSearchTagList(action.tagNode);
        break;
      case Action.REMOVE_SEARCH_TAGLIST_CHANGED:
        AlarmTagStore.removeSearchTagList(action.tagNode);
        break;
      case Action.INTER_DATA_CHANGED:
        AlarmTagStore.setInterData(action.tagNode);
        AlarmTagStore.emitInterData();
        break;
      case Action.CLEAR_SEARCH_TAGLIST:
        AlarmTagStore.clearSearchTagList();
        break;
    }
});

module.exports = AlarmTagStore;
