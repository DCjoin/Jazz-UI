'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Tag from '../constants/actionType/Tag.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Tag.Action;

let TagAction = {
  loadData(nodeId,option,page,alarmType,filters,ids){
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
            AlarmStatus:alarmType
          },
          filters:filters,
          limit: 20,
          page: page,
          size: 20,
          start: 20*(page-1)
          },
        success: function(tagList){

          AppDispatcher.dispatch({
              type: Action.LOAD_TAG_NODE,
              tagList: tagList
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  loadAlarmData(ioData){
    Ajax.post('/Tag.svc/GetPageTagData', {
         params: {
           hierarchyId:ioData.hierId,
           tagId:ioData.tagId,
           pageSize: 20,
          },
        success: function(tagList){

          AppDispatcher.dispatch({
              type: Action.LOAD_ALARM_TAG_NODE,
              tagList: tagList
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }

};

module.exports = TagAction;
