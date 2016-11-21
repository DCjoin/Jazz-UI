
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import assign from 'object-assign';

let _dimensions=null,_tags=null;
const TagSelectStore = assign({}, PrototypeStore, {
  setDimensions(data,name){
    _dimensions=Immutable.fromJS({
      Name:name,
      Id:-1,
      Children:data
    });
  },

  getDimensions(){
    return _dimensions;
  },

  setTags(data){
    _tags=Immutable.fromJS(data);
  },

  getTags(){
    return _tags;
  },

  dispose(){
    _dimensions=null;
    _tags=null;
  }

});

TagSelectStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_KPI_DIMENSION_SUCCESS:
         TagSelectStore.setDimensions(action.data,action.hierarchyName);
         TagSelectStore.emitChange();
         break;
    case Action.GET_KPI_TAGS_SUCCESS:
         TagSelectStore.setTags(action.data);
         TagSelectStore.emitChange();
         break;
    default:
  }
});

export default TagSelectStore;
