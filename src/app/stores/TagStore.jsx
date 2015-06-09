import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Tag from '../constants/actionType/Tag.jsx';
var _data = {};

var TagStore = assign({},PrototypeStore,{
  getDate(){
    return _data;
  },
  setDate(data){

      _data =  data;


  },
});
var Action = Tag.Action;
TagStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
      case Action.LOAD_TAG_NODE:
      console.log("**wyh***TagStore");
      console.log(action.tagList);
           TagStore.setDate(action.tagList);
           TagStore.emitChange();
        break;

    }
});

module.exports = TagStore;
