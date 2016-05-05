'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Tag from '../constants/actionType/Tag.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Tag.Action;

let TagAction = {
  loadData(nodeId, option, page, alarmType, filters, ids) {
    // setTimeout(()=>{
    //   AppDispatcher.dispatch({
    //        type: Action.SET_NODE_LOAGDING
    //   });
    // },0);
    Ajax.post('/Tag.svc/GetTagsByFilter?', {
      params: {
        filter: {
          Ids: ids,
          Association: {
            AssociationId: nodeId,
            AssociationOption: option
          },
          CustomerId: window.currentCustomerId,
          IncludeAssociationName: true,
          AlarmStatus: alarmType
        },
        filters: filters,
        limit: 20,
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(tagList) {

        AppDispatcher.dispatch({
          type: Action.LOAD_TAG_NODE,
          tagList: tagList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  loadAlarmData(ioData) {
    // setTimeout(()=>{
    //   AppDispatcher.dispatch({
    //        type: Action.SET_NODE_LOAGDING
    //   });
    // },0);
    Ajax.post('/Tag.svc/GetPageTagData', {
      params: {
        hierarchyId: ioData.hierId,
        tagId: ioData.tagId,
        pageSize: 20,
      },
      success: function(tagList) {

        AppDispatcher.dispatch({
          type: Action.LOAD_ALARM_TAG_NODE,
          tagList: tagList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setTagStatusByTag(tagNode, selectd) {
    AppDispatcher.dispatch({
      type: Action.SET_TAGSTATUS_TAG,
      node: tagNode,
      selected: selectd
    });
  },
  setTagStatusById(hierId, tagId) {
    AppDispatcher.dispatch({
      type: Action.SET_TAGSTATUS_ID,
      hierId: hierId,
      tagId: tagId
    });

  },
  setTagStatusByTagList(tagList, add) {
    AppDispatcher.dispatch({
      type: Action.SET_TAGSTATUS_TAGLIST,
      tagList: tagList,
      add: add
    });
  },
  setCurrentHierarchyId(hierId) {
    AppDispatcher.dispatch({
      type: Action.SET_HIERARCHYID,
      hierId: hierId
    });
  },
  resetTagInfo(widgetType) {

    AppDispatcher.dispatch({
      type: Action.RESET_TAGINFO,
      widgetType: widgetType
    });

  },
  setCurrentTagList(tagList) {
    AppDispatcher.dispatch({
      type: Action.SET_CURRENT_TAGLIST,
      tagList: tagList
    });
  },
  setCheckAllStatus() {
    AppDispatcher.dispatch({
      type: Action.SET_CHECK_ALL_STATUS,
    });
  },
  clearAlarmSearchTagList() {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.CLEAR_ALARM_SEARCH_TAGLIST,
      });
    }, 0);
  },
  setCurrentDimentionInfo(id, name) {
    AppDispatcher.dispatch({
      type: Action.SET_CURRENT_DIMENTION,
      id: id,
      name: name
    });
  }
};

module.exports = TagAction;
