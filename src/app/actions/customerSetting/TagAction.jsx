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
  }
};

module.exports = TagAction;
