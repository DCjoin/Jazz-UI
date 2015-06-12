'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import {Action} from '../constants/actionType/AlarmTag.jsx';

let searchTagList=[];
let interData=null;

const SEARCH_TAGLIST_CHANGED_EVENT = 'searchtaglistchanged',
      INTER_DATA_CHANGED_EVENT = 'interdatachanged';

var AlarmTagStore = assign({},PrototypeStore,{

  getSearchTagList(){
    return searchTagList;
  },
  setSearchTagList(tagNode){
    searchTagList.push(tagNode);
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
  addSearchTagListListener: function(callback) {
    this.on(SEARCH_TAGLIST_CHANGED_EVENT, callback);
  },
  emitSearchTagList: function() {
    this.emit(SEARCH_TAGLIST_CHANGED_EVENT);
  },
  removeSearchTagListListener: function(callback) {
    this.removeListener(SEARCH_TAGLIST_CHANGED_EVENT, callback);
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
      case Action.SEARCH_TAGLIST_CHANGED:
        AlarmTagStore.setSearchTagList(action.tagNode);
        AlarmTagStore.emitSearchTagList();
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
