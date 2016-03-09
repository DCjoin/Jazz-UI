'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/customerSetting/Tag.jsx';
import Ajax from '../../ajax/ajax.jsx';

let TagAction = {
  getTagListByType: function(type, page, filter) {
    Ajax.post('/Tag.svc/GetTagsByFilter', {
      params: {
        filter: filter,
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(tagData) {
        AppDispatcher.dispatch({
          type: Action.GET_TAG_LIST_SUCCESS,
          tagData: tagData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_TAG_LIST_ERROR
        });
      }
    });
  },
  getTagList: function(page, filter) {
    Ajax.post('/Tag.svc/GetVariableItemsByFilter', {
      params: {
        filter: filter,
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(allTagData) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_TAG_LIST_SUCCESS,
          allTagData: allTagData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_TAG_LIST_ERROR
        });
      }
    });
  },
  setSelectedTagIndex(index) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_TAG,
      index: index
    });
  },
  cancelSaveTag() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_TAG
    });
  },
  modifyTag(data) {
    Ajax.post('/Tag.svc/ModifyTag', {
      params: {
        dto: data
      },
      success: function(tag) {
        AppDispatcher.dispatch({
          type: Action.MODIFT_TAG_SUCCESS,
          tag: tag
        });
      },
      error: function(err, res) {
        console.log(err, res);
        AppDispatcher.dispatch({
          type: Action.MODIFT_TAG_ERROR,
          errorText: res.text
        });
      }
    });
  },
  createTag(data) {
    Ajax.post('/Tag.svc/CreateTag', {
      params: {
        dto: data
      },
      success: function(tag) {
        AppDispatcher.dispatch({
          type: Action.CREATE_TAG_SUCCESS,
          tag: tag
        });
      },
      error: function(err, res) {
        console.log(err, res);
        AppDispatcher.dispatch({
          type: Action.CREATE_TAG_ERROR,
          errorText: res.text
        });
      }
    });
  },
  deleteTagById(id, version) {
    Ajax.post('/Tag.svc/DeleteTag', {
      params: {
        dto: {
          Id: id,
          Version: version
        }
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_TAG_SUCCESS
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.DELETE_TAG_ERROR,
          errorText: res.text
        });
      }
    });
  },
  getTagsData: function(tagId, step, StartTime, EndTime, refreshTagStatus) {
    var that = this;
    Ajax.post('/Energy.svc/GetTagsData', {
      params: {
        limit: 0,
        page: 0,
        start: 0,
        tagIds: [tagId],
        viewOption: {
          DataOption: {
            OriginalValue: true
          },
          Step: 0,
          TimeRanges: [{
            StartTime: StartTime,
            EndTime: EndTime
          }]
        }
      },
      success: function(tagDatas) {
        if (refreshTagStatus) {
          that.getVEETagStatus(tagId, tagDatas);
        } else {
          AppDispatcher.dispatch({
            type: Action.GET_TAG_DATAS_SUCCESS,
            tagDatas: tagDatas,
            tagStatus: false
          });
        }

      },
      error: function(err, res) {}
    });
  },
  getVEETagStatus: function(tagId, tagDatas) {
    Ajax.post('/VEE.svc/GetVEETagStatus', {
      params: {
        tagId: tagId,
      },
      success: function(tagStatus) {
        AppDispatcher.dispatch({
          type: Action.GET_TAG_DATAS_SUCCESS,
          tagDatas: tagDatas,
          tagStatus: tagStatus
        });
      },
      error: function(err, res) {}
    });
  },
  modifyVEETagStatus: function(statusDto) {
    Ajax.post('/VEE.svc/ModifyVEETagStatus', {
      params: {
        statusDto: statusDto,
      },
      success: function(tagStatus) {
        AppDispatcher.dispatch({
          type: Action.GET_TAG_DATAS_SUCCESS,
          tagDatas: false,
          tagStatus: tagStatus
        });
      },
      error: function(err, res) {}
    });
  },
  getTagLogListByCustomerId: function() {
    Ajax.post('/TagImport.svc/GetTagImportHistory', {
      params: {
        customerId: parseInt(window.currentCustomerId)
      },
      success: function(logList) {
        AppDispatcher.dispatch({
          type: Action.GET_LOG_LIST_SUCCESS,
          logList: logList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_LOG_LIST_ERROR,
        });
      }
    });
  },

};

module.exports = TagAction;
