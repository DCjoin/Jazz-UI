import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Tag from '../constants/actionType/Tag.jsx';
var _data = {};

var TagStore = assign({},PrototypeStore,{
  getData(){
    return _data;
  },
  setData(data){

      _data =  data;


  },
});
var Action = Tag.Action;
TagStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
      case Action.LOAD_TAG_NODE:
           TagStore.setData(action.tagList);
           TagStore.emitChange();
        break;

    }
});

module.exports = TagStore;
