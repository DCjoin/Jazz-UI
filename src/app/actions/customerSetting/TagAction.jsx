'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/customerSetting/Tag.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import assign from "object-assign";
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';


var search = null;
var formulaSearch = null;
var lastTagParams={};
let TagAction = {
  getTagListByType: function(customerId,type, page, filterObj) {
    var obj = {
      CustomerId: parseInt(customerId),
      Type: type,
      ReverseFormula: type === 2 ? true : false
    };
    var filter = assign(filterObj, obj);
    if (search) {
      search.abort();
    }
    search = Ajax.post('/Tag/GetTagsByFilter', {
      params: {
        filter: filter,
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(tagData) {
        search = null;
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
  getTagList: function(customerId,page, filterObj) {
    var obj = {
      CustomerId: parseInt(customerId)
    };
    var filter = assign(filterObj, obj);
    if (formulaSearch) {
      formulaSearch.abort();
    }
    formulaSearch = Ajax.post('/Tag/GetTagsByFilter', {
      params: {
        filter: filter,
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(allTagData) {
        formulaSearch = null;
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
    Ajax.post('/Tag/ModifyTag', {
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
    Ajax.post('/Tag/CreateTag', {
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
    Ajax.post('/Tag/DeleteTag', {
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
    lastTagParams={tagId, step, StartTime, EndTime, refreshTagStatus};
    Ajax.post('/Energy/GetTagsData', {
      avoidDuplicate:true,
      tag:tagId,
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
    Ajax.post('/VEE/GetVEETagStatus', {
      params: {
        tagId: tagId,
      },
      success: function(tagStatus) {
        // tagStatus = {
        //   RuleName: "Nancy楼宇A特殊值新",
        //   Status: null,
        //   TagId: 11667
        // };
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
    Ajax.post('/VEE/ModifyVEETagStatus', {
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
  getTagLogListByCustomerId: function(customerId) {
    Ajax.post('/TagImport/GetTagImportHistory', {
      params: {
        customerId: parseInt(customerId)
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
  setFilterObj(filterObj) {
    AppDispatcher.dispatch({
      type: Action.SET_FILTER_OBJ,
      filterObj: filterObj
    });
  },
  setFormulaFilterObj(filterObj) {
    AppDispatcher.dispatch({
      type: Action.SET_FORMULA_FILTER_OBJ,
      filterObj: filterObj
    });
  },
  selectPointToList: function(index) {
    AppDispatcher.dispatch({
      type: Action.SET_POINT_TO_LIST,
      index: index
    });
  },
  selectListToPonit: function(nId) {
    AppDispatcher.dispatch({
      type: Action.SET_LIST_TO_POINT,
      nId: nId
    });
  },
  modifyTagRawData:function(newEnergyData,orgEnergyData ){
    var that=this;
    Ajax.post('/Energy/ModifyTagRawData', {
      params: {
        newEnergyData : newEnergyData,
        orgEnergyData:orgEnergyData
      },
      success: function() {
        var {tagId, step, StartTime, EndTime, refreshTagStatus}=lastTagParams;
        that.getTagsData(tagId, step, StartTime, EndTime, refreshTagStatus);
      },
      error: function(err, res) {
      }
    });
  },
  rollBack:function(tagId,start,end){
    var url=util.replacePathParams(Path.RawData.RollBack, tagId),
        that=this;
    Ajax.post(url, {
      params: {
        StartTime : start,
        EndTime:end
      },
      success: function() {
        var {tagId, step, StartTime, EndTime, refreshTagStatus}=lastTagParams;
        that.getTagsData(tagId, step, StartTime, EndTime, refreshTagStatus);
      },
      error: function(err, res) {
      }
    });
  },

  manualScanTag: function(tagId, startTime, endTime) {
    Ajax.get(
      util.replacePathParams(
        '/vee/manualscantag/{tagId}', 
        tagId), {
        params: {startTime, endTime},
        success: function() {
          AppDispatcher.dispatch({
            type: Action.MANUAL_SCAN_TAG_SUCCESS,
          });
        },
        error: function(err, res) {
          console.log(res);
        }
      }
    );
  }
};

module.exports = TagAction;
