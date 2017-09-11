
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Immutable from 'immutable';
import assign from 'object-assign';
import TreeConstants from '../../constants/TreeConstants.jsx';

let {nodeType} = TreeConstants;
let _dimensions=null,_tags=null,_tagInfo=null;
const TagSelectStore = assign({}, PrototypeStore, {
  addtype(data){
    var f=function(item){
      if(item){
        item.Type=nodeType.Area;
        if(item.Children){
          item.Children.forEach(child=>{
            f(child)
          })
        }
      }
    }
    let result=data.map(el=>{
      f(el);
      return el
    })
    return result
  },
  setDimensions(data,name){
    _dimensions=Immutable.fromJS({
      Name:name,
      Id:-1,
      Children:data?this.addtype(data):[],
      Type:nodeType.Building
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
  setTagInfo(info){
    _tagInfo=info;
  },
  getSelectedTreeNode(){
    if(!_tagInfo) return null
    return Immutable.fromJS({
        Id:_tagInfo.AreaDimensionId?_tagInfo.AreaDimensionId:-1
    })
  },
  dispose(){
    _dimensions=null;
    _tags=null;
    _tagInfo=null;
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
    case Action.GET_TAG_INFO_SUCCESS:
         TagSelectStore.setTagInfo(action.tagInfo);
         TagSelectStore.emitChange();
         break;
    default:
  }
});

export default TagSelectStore;
