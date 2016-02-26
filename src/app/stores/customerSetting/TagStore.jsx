'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/customerSetting/Tag.jsx';

let _tagList = Immutable.fromJS([]),
  _total = 0,
  _selectedTagIndex = null,
  _selectedTag = null,
  _errorCode = null,
  _errorMessage = null;

let CHANGE_TAG_EVENT = 'changetag';
let CHANGE_SELECTED_TAG_EVENT = 'changeselectedtag';
let ERROR_CHANGE_EVENT = 'errorchange';

var TagStore = assign({}, PrototypeStore, {
  getTagList() {
    return _tagList;
  },
  getTagTotalNum() {
    return _total;
  },
  setTagList(tagData) {
    if (tagData !== null) {
      _total = tagData.total;
      _tagList = Immutable.fromJS(tagData.GetTagsByFilterResult);
      if (_tagList.size !== 0) {
        if (_selectedTagIndex === null) {
          _selectedTagIndex = 0;
          _selectedTag = _tagList.get(0);
        } else {
          var index = _tagList.findIndex((item) => {
            if (item.get('Id') === _selectedTag.get('Id')) {
              return true;
            }
          });
          if (index !== -1 && _selectedTagIndex !== index) {
            _selectedTagIndex = index;
          }
        }
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
  initErrorText(errorText) {
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
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
  emitErrorhange() {
    this.emit(ERROR_CHANGE_EVENT);
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
    case Action.SET_SELECTED_TAG:
      TagStore.setSelectedTagIndex(action.index);
      TagStore.emitSelectedTagChange();
      break;
    case Action.CANCEL_SAVE_TAG:
      TagStore.emitSelectedTagChange();
      break;
    case Action.MODIFT_TAG_SUCCESS:
    case Action.CREATE_TAG_SUCCESS:
      TagStore.setSelectedTag(action.tag);
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
      TagStore.emitErrorhange();
      break;
  }
});

module.exports = TagStore;
