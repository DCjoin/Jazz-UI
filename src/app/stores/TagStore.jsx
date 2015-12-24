import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Tag from '../constants/actionType/Tag.jsx';
import AlarmTag from '../constants/actionType/AlarmTag.jsx';
import AlarmSetting from '../constants/actionType/Setting.jsx';
import Folder from '../constants/actionType/Folder.jsx';

let LOAD_TAG_NODE_EVENT = 'loadtagnode';
let LOAD_ALARM_TAG_NODE_EVENT = 'loadalarmtagnode';
let TAG_TOTAL_EVENT = 'tagtotal';
let TAG_STATUS_EVENT = 'tagstatus';
let CHECKALL_STATUS_EVENT = 'checkallstatus';
let NODE_LOADING_EVENT = 'nodeloading';
let BASELINE_BTN_DISABLED_EVENT = 'baselinebtndisabled';
let WEATHER_BTN_DISABLED_EVENT = 'weatherbtndisabled';
let DATA_CHANGED_EVENT = "datachanged";
var _data = [];
var _totalTagStatus = [];
var _hierId = null;
var _dimId = null;
var _dimName = null;
var _tagTotal = 0;
var _tagSum = 0;
var _tagList = [];
var _checkall_disable_status = null;
var _checkall_checked_status = null;
var _isLoading = false;
var _tagTotalStatus = false;
var baseline_btn_disabled = false;
var weather_btn_disabled = false;

var TagStore = assign({}, PrototypeStore, {
  setTagTotalStatus: function() {
    _tagTotalStatus = !_tagTotalStatus;
  },
  getTagTotalStatus: function() {
    return _tagTotalStatus;
  },
  setNodeLoading: function() {
    _isLoading = true;
  },
  getNodeLoading: function() {
    return _isLoading;
  },
  setTagStatusByTag: function(node, selected) {
    var hasHierId = false;
    var tagTotal = _tagTotal;
    //total的加减 emit total change 判断 total>30  和 第一次小于30的情况 都调用emit

    _totalTagStatus.forEach(function(tagNode) {
      if (tagNode.hierId == _hierId) {
        hasHierId = true;
        if (selected) {
          tagNode.tagStatus = tagNode.tagStatus.push(node.Id);
        } else {
          let index = tagNode.tagStatus.indexOf(node.Id);
          tagNode.tagStatus = tagNode.tagStatus.delete(index);
        }

      }
    });
    if (!hasHierId) {
      _totalTagStatus.push({
        hierId: _hierId,
        tagStatus: Immutable.List.of(node.Id),
      });
    }

    if (selected) {
      _tagTotal++;
      if (_tagTotal == _tagSum) {
        this.setTagTotalStatus();
      }
    } else {
      if (tagTotal == _tagSum) {
        this.setTagTotalStatus();
      }
      _tagTotal--;
    }

    this.checkAllStatus();
    this.checkBaselineBtnDisabled();
    this.checkWeatherBtnDisabled();
  },
  setTagStatusById: function(hierId, tagId) {
    _tagTotal++;
    if (_totalTagStatus.length === 0) {
      _totalTagStatus.push({
        hierId: hierId,
        tagStatus: Immutable.List.of(tagId),
      });
    } else {
      let hasHierId = false;
      _totalTagStatus.forEach(function(tagNode) {
        if (tagNode.hierId == hierId) {
          hasHierId = true;
          tagNode.tagStatus = tagNode.tagStatus.push(tagId);
        }
      });
      if (!hasHierId) {
        _totalTagStatus.push({
          hierId: hierId,
          tagStatus: Immutable.List.of(tagId),
        });
      }
    }
    this.setCurrentHierarchyId(hierId);
  },
  setTagStatusByTagList: function(tagList, add) {
    var hasHierId = false;
    var tagTotal = _tagTotal;
    var tagStatus = Immutable.List([]);
    _totalTagStatus.forEach(function(tagNode) {
      if (tagNode.hierId == _hierId) {
        hasHierId = true;
        tagStatus = tagNode.tagStatus;
        tagList.forEach(function(tagNode) {
          let index = tagStatus.indexOf(tagNode.Id);
          if (add) {
            if (index < 0) {
              tagStatus = tagStatus.push(tagNode.Id);
              _tagTotal++;
            }
          } else {
            if (index >= 0) {
              tagStatus = tagStatus.delete(index);
              _tagTotal--;
            }
          }

        });
        tagNode.tagStatus = tagStatus;
      }
    });
    if (!hasHierId) {
      tagList.forEach(function(tagNode) {
        tagStatus = tagStatus.push(tagNode.Id);
        _tagTotal++;
      });
      _totalTagStatus.push({
        hierId: _hierId,
        tagStatus: tagStatus,
      });
    }
    if (add) {
      if (_tagTotal == _tagSum) {
        this.setTagTotalStatus();
      }
    } else {
      if (tagTotal == _tagSum) {
        this.setTagTotalStatus();
      }
    }
    this.checkBaselineBtnDisabled();
    this.checkWeatherBtnDisabled();
  },
  getCurrentHierIdTagStatus: function() {
    var tagStatus = Immutable.List([]);
    _totalTagStatus.forEach(function(tagNode) {
      if (tagNode.hierId == _hierId) {
        tagStatus = tagNode.tagStatus;
      }
    });
    return tagStatus;
  },
  getTotalTagStatus: function() {
    return _totalTagStatus;
  },
  removeTagStatusByTagId: function(tagId) {
    _totalTagStatus.forEach(function(tagNode) {
      let index = tagNode.tagStatus.indexOf(tagId);
      if (index >= 0) {
        tagNode.tagStatus = tagNode.tagStatus.delete(index);
        _tagTotal--;
      }
    });
    if (_tagTotalStatus && _tagTotal < _tagSum) {
      this.setTagTotalStatus();
    }
    this.checkAllStatus();
    this.checkBaselineBtnDisabled();
    this.checkWeatherBtnDisabled();
  },
  clearTagStatus: function() {
    _tagTotal = 0;
    _totalTagStatus = [];
    this.checkAllStatus();
    if (_tagTotalStatus) {
      this.setTagTotalStatus();
    }
    this.checkBaselineBtnDisabled();
    this.checkWeatherBtnDisabled();
  },
  getTagTotal: function() {
    return _tagTotal;
  },
  getTagSum: function() {
    return _tagSum;
  },
  resetTagInfo: function(widgetType) {
    _data = [];
    _totalTagStatus = [];
    _dimId = null;
    _dimName = null;
    _tagTotal = 0;
    _tagList = [];
    baseline_btn_disabled = false;
    weather_btn_disabled = false;
    _tagTotalStatus = false;
    if (widgetType == 'Label') {
      _tagSum = 3;
    } else {
      _tagSum = 30;
    }
  },
  setCurrentHierarchyId: function(hierId) {
    _hierId = hierId;
    _dimId = null;
    _dimName = null;
  },
  setCurrentTagList: function(tagList) {
    _tagList = tagList;
  },
  getCurrentHierarchyId: function(hierId) {
    return _hierId;
  },
  checkAllStatus: function() {
    var length = _tagList.length;
    var selectedNum = 0;
    var tagStatus = Immutable.List([]);
    var checkStauts = null;
    _totalTagStatus.forEach(function(tagNode) {
      if (tagNode.hierId == _hierId) {
        tagStatus = tagNode.tagStatus;
      }
    });
    _tagList.forEach(function(tagNode) {
      if (tagStatus.indexOf(tagNode.Id) >= 0) {
        selectedNum++;
      }
    });
    if ((selectedNum == length) && (length !== 0)) {
      _checkall_checked_status = true;
    } else {
      _checkall_checked_status = false;
    }
    checkStauts = ((length - selectedNum + _tagTotal) > _tagSum);

    if (_checkall_checked_status) {
      _checkall_disable_status = false;
    } else {
      if (_tagList.length === 0) {
        _checkall_disable_status = true;
      } else {
        _checkall_disable_status = checkStauts;
      }
    }
  },
  getCheckAllDisabledStatus: function() {
    this.checkAllStatus();
    return _checkall_disable_status;
  },
  getCheckAllCheckedStatus: function() {
    return _checkall_checked_status;
  },
  checkBaselineBtnDisabled: function() {
    if (_tagTotal > 1) {
      baseline_btn_disabled = true;
    } else {
      baseline_btn_disabled = false;
    }
    this.emitBaselineBtnDisabledChange();
  },
  checkWeatherBtnDisabled: function() {
    if (_totalTagStatus.length > 1) {
      let validHierCount = 0;
      _totalTagStatus.forEach(item => {
        if (item.tagStatus && item.tagStatus.size > 0) {
          ++validHierCount;
        }
      });
      if (validHierCount < 2) {
        weather_btn_disabled = false;
      } else {
        weather_btn_disabled = true;
      }
    } else {
      weather_btn_disabled = false;
    }
    this.emitWeatherBtnDisabledChange();
  },
  getBaselineBtnDisabled: function() {
    return baseline_btn_disabled;
  },
  getWeatherBtnDisabled: function() {
    return weather_btn_disabled;
  },
  // getNodeByHierId:function(hierId){
  //   var node=null;
  //   var f=function(item){
  //     if(item.Id==hierId){
  //       node=item;
  //     }
  //     else {
  //       if(item.Children){
  //         item.Children.forEach(function(child){
  //           f(child);
  //         });
  //       }
  //     }
  //   };
  //   f(_data);
  //   return node;
  // },
  getData() {
    return _data;
  },
  setData(data) {
    _data = data;
    _isLoading = false;
    this.setCurrentTagList(data.GetTagsByFilterResult);
    //每次load当页的taglist，判断“全选”的状态 disable or not?

  },
  setDataByAlarm(data) {
    _data = data;
    _isLoading = false;
    this.setCurrentTagList(data.GetPageTagDataResult);
  },
  // doWidgetDtos: function(widgetDto) {
  //   this.resetTagInfo(widgetDto.WidgetType);
  //   this.setCurrentDimInfo(null, null);
  //   let that = this;
  //   if (widgetDto.WidgetType == 'Labelling' || widgetDto.WidgetType == 'Ratio' || widgetDto.BizType == 'Energy' || widgetDto.BizType == 'UnitEnergy') {
  //     let convertWidgetOptions2TagOption = function(WidgetOptions) {
  //       let tagOptions = [];
  //       WidgetOptions.forEach(item => {
  //         tagOptions.push({
  //           hierId: item.HierId,
  //           hierName: item.NodeName,
  //           tagId: item.TargetId,
  //           tagName: item.TargetName
  //         });
  //       });
  //       return tagOptions;
  //     };
  //     let tagOptions = convertWidgetOptions2TagOption(widgetDto.WidgetOptions);
  //
  //     tagOptions.forEach(item => {
  //       that.setTagStatusById(item.hierId, item.tagId);
  //     });
  //     if (_tagTotal == _tagSum) {
  //       this.setTagTotalStatus();
  //     }
  //     this.emitTagStatusChange();
  //   }
  // },
  doWidgetDtos: function(widgetDto) {
    var that = this;
    this.resetTagInfo(widgetDto.WidgetType);
    this.setCurrentDimInfo(null, null);

    if (widgetDto.WidgetType == 'Labelling' || widgetDto.WidgetType == 'Ratio' || widgetDto.BizType == 'Energy' || widgetDto.BizType == 'UnitEnergy') {
      let convertWidgetOptions2TagOption = function(WidgetOptions) {
        let tagOptions = [];
        WidgetOptions.forEach(item => {
          tagOptions.push({
            hierId: item.HierId,
            hierName: item.NodeName,
            dimId: item.DimensionId,
            dimName: item.DimensionName,
            tagId: item.TargetId,
            tagName: item.TargetName
          });
        });
        return tagOptions;
      };
      let tagOptions = convertWidgetOptions2TagOption(widgetDto.WidgetOptions);



      if (tagOptions.length > 0) {
        _hierId = null;
        tagOptions.forEach(item => {
          that.setTagStatusById(item.hierId, item.tagId);
        });
        let lastTagOption = tagOptions[tagOptions.length - 1];

        //this.setCurrentHierarchyInfo(lastTagOption.hierId, lastTagOption.hierName);
        this.setCurrentDimInfo({
          Id: lastTagOption.dimId,
          Name: lastTagOption.dimName
        });
        if (_tagTotal == _tagSum) {
          this.setTagTotalStatus();
        }
        this.emitTagStatusChange();
      }
    } else {
      let contentSyntax = widgetDto.ContentSyntax;
      let contentObj = JSON.parse(contentSyntax);
      if (contentObj !== null) {
        _hierId = null;
        if (widgetDto.BizType.indexOf('Cost') >= 0) {
          let viewAssociation = contentObj.viewAssociation;
          if (viewAssociation.HierarchyId !== null) {
            this.setCurrentHierarchyId(viewAssociation.HierarchyId);
            if (viewAssociation.AreaDimensionId !== null) {
              let node = {
                Id: viewAssociation.AreaDimensionId,
                Name: null
              };
              this.setCurrentDimInfo(node);
            }
          }
        } else {
          if (contentObj.hierarchyId !== null) {
            this.setCurrentHierarchyId(contentObj.hierarchyId);
          }
        }

      }

    }

  },
  setCurrentDimInfo: function(id, name) {
    _dimId = id;
    _dimName = name;
  },
  getCurrentDimInfo: function() {
    return {
      dimId: _dimId,
      dimName: _dimName
    };
  },
  emitTagNodeChange: function() {
    this.emit(LOAD_TAG_NODE_EVENT);
  },

  addTagNodeListener: function(callback) {
    this.on(LOAD_TAG_NODE_EVENT, callback);
  },

  removeTagNodeListener: function(callback) {
    this.removeListener(LOAD_TAG_NODE_EVENT, callback);
    this.dispose();
  },
  emitAlarmTagNodeChange: function() {
    this.emit(LOAD_ALARM_TAG_NODE_EVENT);
  },

  addAlarmTagNodeListener: function(callback) {
    this.on(LOAD_ALARM_TAG_NODE_EVENT, callback);
  },

  removeAlarmTagNodeListener: function(callback) {
    this.removeListener(LOAD_ALARM_TAG_NODE_EVENT, callback);
    this.dispose();
  },
  emitTagTotalChange: function() {
    this.emit(TAG_TOTAL_EVENT);
  },

  addTagTotalListener: function(callback) {
    this.on(TAG_TOTAL_EVENT, callback);
  },

  removeTagTotalListener: function(callback) {
    this.removeListener(TAG_TOTAL_EVENT, callback);
    this.dispose();
  },
  emitTagStatusChange: function() {
    this.emit(TAG_STATUS_EVENT);
  },

  addTagStatusListener: function(callback) {
    this.on(TAG_STATUS_EVENT, callback);
  },

  removeTagStatusListener: function(callback) {
    this.removeListener(TAG_STATUS_EVENT, callback);
    this.dispose();
  },
  emitCheckAllStatusChange: function() {
    this.emit(CHECKALL_STATUS_EVENT);
  },

  addCheckAllStatusListener: function(callback) {
    this.on(CHECKALL_STATUS_EVENT, callback);
  },

  removeCheckAllStatusListener: function(callback) {
    this.removeListener(CHECKALL_STATUS_EVENT, callback);
    this.dispose();
  },
  emitNodeLoadingChange: function() {
    this.emit(NODE_LOADING_EVENT);
  },

  addNodeLoadingListener: function(callback) {
    this.on(NODE_LOADING_EVENT, callback);
  },

  removeNodeLoadingListener: function(callback) {
    this.removeListener(NODE_LOADING_EVENT, callback);
    this.dispose();
  },
  emitBaselineBtnDisabledChange: function() {
    this.emit(BASELINE_BTN_DISABLED_EVENT);
  },
  emitWeatherBtnDisabledChange: function() {
    this.emit(WEATHER_BTN_DISABLED_EVENT);
  },

  addBaselineBtnDisabledListener: function(callback) {
    this.on(BASELINE_BTN_DISABLED_EVENT, callback);
  },
  addWeatherBtnDisabledListener: function(callback) {
    this.on(WEATHER_BTN_DISABLED_EVENT, callback);
  },

  removeBaselineBtnDisabledListener: function(callback) {
    this.removeListener(BASELINE_BTN_DISABLED_EVENT, callback);
    this.dispose();
  },
  removeWeatherBtnDisabledListener: function(callback) {
    this.removeListener(WEATHER_BTN_DISABLED_EVENT, callback);
    this.dispose();
  },

  addSettingDataListener: function(callback) {
    this.on(DATA_CHANGED_EVENT, callback);
  },
  emitSettingData: function() {
    this.emit(DATA_CHANGED_EVENT);
  },
  removeSettingDataListener: function(callback) {
    this.removeListener(DATA_CHANGED_EVENT, callback);
    this.dispose();
  },

});
var TagAction = Tag.Action,
  AlarmTagAction = AlarmTag.Action,
  AlarmSettingAction = AlarmSetting.Action,
  FolderAction = Folder.Action;
TagStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case TagAction.LOAD_TAG_NODE:
      TagStore.setData(action.tagList);
      TagStore.emitTagNodeChange();
      break;
    case TagAction.LOAD_ALARM_TAG_NODE:
      TagStore.setDataByAlarm(action.tagList);
      TagStore.emitAlarmTagNodeChange();
      break;
    case TagAction.SET_NODE_LOAGDING:
      TagStore.setNodeLoading();
      TagStore.emitNodeLoadingChange();
      break;
    case TagAction.SET_TAGSTATUS_TAG:
      TagStore.setTagStatusByTag(action.node, action.selected);
      TagStore.emitTagStatusChange();
      break;
    case TagAction.SET_TAGSTATUS_ID:
      TagStore.setTagStatusById(action.hierId, action.tagId);
      TagStore.emitTagStatusChange();
      break;
    case TagAction.SET_TAGSTATUS_TAGLIST:
      TagStore.setTagStatusByTagList(action.tagList, action.add);
      TagStore.emitTagStatusChange();
      break;
    case TagAction.SET_HIERARCHYID:
      TagStore.setCurrentHierarchyId(action.hierId);
      break;
    case AlarmTagAction.REMOVE_SEARCH_TAGLIST_CHANGED:
      TagStore.removeTagStatusByTagId(action.tagNode.tagId);
      TagStore.emitTagStatusChange();
      break;
    // case AlarmTagAction.ADD_SEARCH_TAGLIST_CHANGED:
    //       TagStore.removeTagStatusByTagId(action.tagNode.tagId);
    //       TagStore.emitTagStatusChange();
    //   break;
    case AlarmTagAction.CLEAR_SEARCH_TAGLIST:
      TagStore.clearTagStatus();
      TagStore.emitTagStatusChange();
      break;
    case TagAction.RESET_TAGINFO:
      TagStore.resetTagInfo(action.widgetType);
      break;
    case AlarmSettingAction.SET_ALARM_DATA_SUCCESS:
      TagStore.emitSettingData();
      break;
    case FolderAction.GET_WIDGETDTOS_SUCCESS:
      TagStore.doWidgetDtos(action.widgetDto[0]);
      break;
    case TagAction.SET_CURRENT_DIMENTION:
      TagStore.setCurrentDimInfo(action.id, action.name);
      break;


  }
});

module.exports = TagStore;
