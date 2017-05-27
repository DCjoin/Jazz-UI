'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

var _total=0,
    _tagList=null;

const InputDataStore = assign({}, PrototypeStore, {
  setTagList(tagData){
    if (tagData !== null) {
      _total = tagData.total;
      _tagList = Immutable.fromJS(tagData.Data);
    } else {
      _total = 0;
      _tagList = Immutable.fromJS([]);
    }
  },
  getTagList(){
    return _tagList;
  },
  getTotal(){
    return _total;
  }
})

InputDataStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_MANUAL_TAGS:
          InputDataStore.setTagList(action.tagData);
          InputDataStore.emitChange()
      break;
    default:
  }
});

export default InputDataStore
