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
};

module.exports = TagAction;
