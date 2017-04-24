'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Role.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Immutable from 'immutable';
import UserAction from './UserAction.jsx';
import CommonFuns from '../util/Util.jsx';
let RoleAction = {
  setCurrentSelectedId(id) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_ROLE_ID,
      id: id
    });
  },
  merge: function(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_ROLE,
      data: data
    });
  },
  createRole: function(roledata) {
    Ajax.post('/AccessControl/CreateRole', {
      params: {
        dto: roledata
      },
      commonErrorHandling: false,
      success: function(role) {
        UserAction.getAllRoles();
        AppDispatcher.dispatch({
          type: Action.CREATE_ROLE,
          role: role
        });
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.ROLE_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  updateRole: function(roledata) {
    Ajax.post('/AccessControl/ModifyRole', {
      params: {
        dto: roledata
      },
      commonErrorHandling: false,
      success: function(role) {
        UserAction.getAllRoles();
        AppDispatcher.dispatch({
          type: Action.UPDATE_ROLE,
          role: role
        });
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.ROLE_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  deleteRole: function(roledata) {
    Ajax.post('/AccessControl/DeleteRole', {
      params: {
        dto: {
          Id: roledata.Id,
          Version: roledata.Version
        }
      },
      commonErrorHandling: false,
      success: function(role) {
        AppDispatcher.dispatch({
          type: Action.Delete_ROLE_SUCCESS,
          selectedId: roledata.Id
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.ROLE_ERROR,
          title: I18N.format(I18N.Setting.Role.ErrorTitle, roledata.Name),
          content: I18N.format(I18N.Setting.Role.ErrorContent, roledata.Name),
        });
      }
    });
  },
};
module.exports = RoleAction;
