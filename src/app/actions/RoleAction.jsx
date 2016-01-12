'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Role.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
import UserAction from './UserAction.jsx';
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
    Ajax.post('/AccessControl.svc/CreateRole', {
      params: {
        dto: roledata
      },
      success: function(role) {
        UserAction.getAllRoles();
        AppDispatcher.dispatch({
          type: Action.CREATE_ROLE,
          role: role
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  updateRole: function(roledata) {
    Ajax.post('/AccessControl.svc/ModifyRole', {
      params: {
        dto: roledata
      },
      success: function(role) {
        UserAction.getAllRoles();
        AppDispatcher.dispatch({
          type: Action.UPDATE_ROLE,
          role: role
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  deleteRole: function(roledata) {
    Ajax.post('/AccessControl.svc/DeleteRole', {
      params: {
        dto: {
          Id: roledata.Id,
          Version: roledata.Version
        }
      },
      success: function(role) {
        AppDispatcher.dispatch({
          type: Action.Delete_ROLE_SUCCESS,
          selectedId: roledata.Id
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
};
module.exports = RoleAction;
