import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Tag from '../constants/actionType/Tag.jsx';

let LOAD_TAG_NODE_EVENT = 'loadtagnode';
let LOAD_ALARM_TAG_NODE_EVENT = 'loadalarmtagnode';
var _data = {};


var TagStore = assign({},PrototypeStore,{
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

    }
});

module.exports = TagStore;
