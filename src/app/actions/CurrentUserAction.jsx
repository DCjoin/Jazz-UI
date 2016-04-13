'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/CurrentUser.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
var UserTypeName = null,
  UserType = null;
let CurrentUserAction = {
  getUser: function(userId) {
    var that = this;
    Ajax.post('/User.svc/GetUsersByFilter', {
      params: {
        filter: {
          UserIds: [userId]
        }
      },
      success: function(userList) {

        console.log('Here:'+JSON.stringify(userList,0,1));
        UserTypeName = userList[0].UserTypeName;
        UserType = userList[0].UserType;
        that.getRoles(userId);
        AppDispatcher.dispatch({
          type: Action.GET_USER,
          userInfo: userList[0]
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getRoles: function(userId) {
    Ajax.post('/AccessControl.svc/GetRolesByFilter', {
      params: {
        filter: {
          UserIds: [userId]
        }
      },
      success: function(list) {
        AppDispatcher.dispatch({
          type: Action.GET_ROLE,
          userId: userId,
          role: list[0],
          userType: UserType
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });


  },
  resetPassword: function(passwordDto) {
    Ajax.post('/User.svc/ResetPassword', {
      params: {
        dto: passwordDto
      },
      commonErrorHandling: false,
      success: function(dto) {
        AppDispatcher.dispatch({
          type: Action.PASSWORD_SUCCESS,
          version: dto.Version
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.PASSWORD_ERROR,
          res: res
        });
      }
    });
  },
  modifyProfile: function(data) {
    Ajax.post('/User.svc/ModifyProfile', {
      params: {
        dto: {
          Comment: data.Comment,
          Email: data.Email,
          Id: data.Id,
          Name: data.Name,
          RealName: data.RealName,
          Telephone: data.Telephone,
          Title: data.Title,
          UserType: data.UserType,
          Version: data.Version
        }
      },
      commonErrorHandling: false,
      success: function(userInfo) {
        userInfo.UserTypeName = UserTypeName;
        AppDispatcher.dispatch({
          type: Action.GET_USER,
          userInfo: userInfo
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.PASSWORD_ERROR,
          res: res
        });
      }
    });
  },
};

module.exports = CurrentUserAction;
