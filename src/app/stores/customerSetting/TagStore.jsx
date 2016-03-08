'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/customerSetting/Tag.jsx';

let _tagList = Immutable.fromJS([]),
  _allTagList = Immutable.fromJS([]),
  _logList = Immutable.fromJS([]),
  _allTotal = 0,
  _total = 0,
  _selectedTagIndex = null,
  _selectedTag = null,
  _errorCode = null,
  _errorMessage = null,
  _tagDatas = Immutable.fromJS([]),
  _tagStatus = Immutable.fromJS({});

let CHANGE_TAG_EVENT = 'changetag';
let CHANGE_ALL_TAG_EVENT = 'changealltag';
let CHANGE_LOG_EVENT = 'changelog';
let CHANGE_SELECTED_TAG_EVENT = 'changeselectedtag';
let ERROR_CHANGE_EVENT = 'errorchange';
let TAG_DATAS_CHANGE_EVENT = 'tagdataschange';


var TagStore = assign({}, PrototypeStore, {
  getTagList() {
    return _tagList;
  },
  getAllTagList() {
    return _allTagList;
  },
  getTagLogList() {
    return _logList;
  },
  getTagTotalNum() {
    return _total;
  },
  getTotal() {
    return _allTotal;
  },
  setTagList(tagData) {
    if (tagData !== null) {
      _total = tagData.total;
      _tagList = Immutable.fromJS(tagData.GetTagsByFilterResult);
      if (_tagList.size !== 0) {
        _selectedTagIndex = 0;
        _selectedTag = _tagList.get(0);
      } else {
        _selectedTagIndex = null;
        _selectedTag = null;
      }
    } else {
      _total = 0;
      _tagList = Immutable.fromJS([]);
      _selectedTagIndex = null;
      _selectedTag = null;
    }
  },
  setAllTagList(allTagData) {
    if (allTagData !== null) {
      _allTotal = allTagData.total;
      _allTagList = Immutable.fromJS(allTagData.GetVariableItemsByFilterResult);
    } else {
      _allTotal = 0;
      _allTagList = Immutable.fromJS([]);
    }
  },
  setTagLogList(logList) {
    if (logList) {
      _logList = Immutable.fromJS(logList);
    }
  },
  deleteTag() {
    _tagList = _tagList.delete(_selectedTagIndex);
    var length = _tagList.size;
    if (length !== 0) {
      if (_selectedTagIndex === length) {
        _selectedTagIndex = length - 1;
      }
      _selectedTag = _tagList.get(_selectedTagIndex);
    } else {
      _selectedTagIndex = null;
      _selectedTag = null;
    }
  },
  setSelectedTag(tag) {
    _selectedTag = Immutable.fromJS(tag);
    _tagList = _tagList.set(_selectedTagIndex, _selectedTag);
  },
  addSelectedTag(tag) {
    _selectedTag = Immutable.fromJS(tag);
    _tagList = _tagList.unshift(_selectedTag);
    _selectedTagIndex = 0;
  },
  getSelectedTag() {
    return _selectedTag;
  },
  getSelectedTagIndex() {
    return _selectedTagIndex;
  },
  setSelectedTagIndex(index) {
    if (index === null) {
      _selectedTagIndex = null;
      _selectedTag = null;
    } else {
      _selectedTagIndex = index;
      _selectedTag = _tagList.get(_selectedTagIndex);
    }
  },
  getErrorMessage() {
    return _errorMessage;
  },
  getErrorCode() {
    return _errorCode;
  },
  getRuleType: function() {
    return ([
      {
        type: I18N.Setting.VEEMonitorRule.NegativeValue,
        id: 2
      },
      {
        type: I18N.Setting.VEEMonitorRule.ZeroValue,
        id: 3
      },
      {
        type: I18N.Setting.VEEMonitorRule.NullValue,
        id: 1
      }
    ])
  },
  initErrorText(errorText) {
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
  },

  // for PtagRawData
  setTagDatas: function(tagDatas, tagStatus) {
    _tagDatas = Immutable.fromJS(tagDatas);
    if (tagStatus !== false) {
      _tagStatus = tagStatus === null ? Immutable.fromJS({}) : Immutable.fromJS(tagStatus);
    }
  },
  getTagDatas: function() {
    return _tagDatas
  },
  getTagStatus: function() {
    return _tagStatus
  },
  emitTagListChange: function() {
    this.emit(CHANGE_TAG_EVENT);
  },
  addTagListChangeListener: function(callback) {
    this.on(CHANGE_TAG_EVENT, callback);
  },
  removeTagListChangeListener: function(callback) {
    this.removeListener(CHANGE_TAG_EVENT, callback);
  },
  emitAllTagListChange: function() {
    this.emit(CHANGE_ALL_TAG_EVENT);
  },
  addAllTagListChangeListener: function(callback) {
    this.on(CHANGE_ALL_TAG_EVENT, callback);
  },
  removeAllTagListChangeListener: function(callback) {
    this.removeListener(CHANGE_ALL_TAG_EVENT, callback);
  },
  emitTagLogListChange: function() {
    this.emit(CHANGE_LOG_EVENT);
  },
  addTagLogListChangeListener: function(callback) {
    this.on(CHANGE_LOG_EVENT, callback);
  },
  removeTagLogListChangeListener: function(callback) {
    this.removeListener(CHANGE_LOG_EVENT, callback);
  },
  emitSelectedTagChange: function() {
    this.emit(CHANGE_SELECTED_TAG_EVENT);
  },
  addSelectedTagChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_TAG_EVENT, callback);
  },
  removeSelectedTagChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_TAG_EVENT, callback);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },
  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },
  emitErrorChange() {
    this.emit(ERROR_CHANGE_EVENT);
  },
  addTagDatasChangeListener(callback) {
    this.on(TAG_DATAS_CHANGE_EVENT, callback);
  },
  removeTagDatasChangeListener(callback) {
    this.removeListener(TAG_DATAS_CHANGE_EVENT, callback);
  },
  emitTagDatasChange() {
    this.emit(TAG_DATAS_CHANGE_EVENT);
  }
});
TagStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_TAG_LIST_SUCCESS:
      TagStore.setTagList(action.tagData);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.GET_TAG_LIST_ERROR:
      TagStore.setTagList(null);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.GET_ALL_TAG_LIST_SUCCESS:
      TagStore.setAllTagList(action.allTagData);
      TagStore.emitAllTagListChange();
      break;
    case Action.GET_ALL_TAG_LIST_ERROR:
      TagStore.setALLTagList(null);
      TagStore.emitALLTagListChange();
      break;
    case Action.GET_LOG_LIST_SUCCESS:
      TagStore.setTagLogList(action.logList);
      TagStore.emitTagLogListChange();
      break;
    case Action.GET_LOG_LIST_ERROR:
      TagStore.setTagLogList([]);
      TagStore.emitTemplateListChange();
      break;
    case Action.SET_SELECTED_TAG:
      TagStore.setSelectedTagIndex(action.index);
      TagStore.emitSelectedTagChange();
      break;
    case Action.CANCEL_SAVE_TAG:
      TagStore.emitSelectedTagChange();
      break;
    case Action.MODIFT_TAG_SUCCESS:
      TagStore.setSelectedTag(action.tag);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.CREATE_TAG_SUCCESS:
      TagStore.addSelectedTag(action.tag);
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.DELETE_TAG_SUCCESS:
      TagStore.deleteTag();
      TagStore.emitTagListChange();
      TagStore.emitSelectedTagChange();
      break;
    case Action.MODIFT_TAG_ERROR:
    case Action.CREATE_TAG_ERROR:
    case Action.DELETE_TAG_ERROR:
      TagStore.initErrorText(action.errorText);
      TagStore.emitErrorChange();
      break;
    case Action.GET_TAG_DATAS_SUCCESS:
      TagStore.setTagDatas(action.tagDatas, action.tagStatus);
      TagStore.emitTagDatasChange();
      break;
  }
});

module.exports = TagStore;
