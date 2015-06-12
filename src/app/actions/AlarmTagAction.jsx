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
  clearSearchTagList(){
    AppDispatcher.dispatch({
        type: Action.CLEAR_SEARCH_TAGLIST
    });
  }

};

module.exports = AlarmTagAction;
