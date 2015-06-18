'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/AlarmTag.jsx';

let AlarmTagAction = {
  setSearchTagList(HierId,HierName,TagId,TagName){
    var node={
        hierId:HierId,
        hierName:HierName,
        tagId:TagId,
        tagName:TagName
      };
    AppDispatcher.dispatch({
        type: Action.SEARCH_TAGLIST_CHANGED,
        tagNode: node
    });
  },
  setInterData(iaData){
    AppDispatcher.dispatch({
        type: Action.INTER_DATA_CHANGED,
        tagNode: iaData
    });
  },
  addSearchTagList(tagData){
    AppDispatcher.dispatch({
        type: Action.ADD_SEARCH_TAGLIST_CHANGED,
        tagNode: tagData
    });
  },

  removeSearchTagList(tagData){
    AppDispatcher.dispatch({
        type: Action.REMOVE_SEARCH_TAGLIST_CHANGED,
        tagNode: tagData
    });
  },
  clearSearchTagList(){
    AppDispatcher.dispatch({
        type: Action.CLEAR_SEARCH_TAGLIST
    });
  }

};

module.exports = AlarmTagAction;
