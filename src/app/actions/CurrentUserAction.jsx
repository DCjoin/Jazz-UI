'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import SelectCustomerActionCreator from 'actions/SelectCustomerActionCreator.jsx';
import UserAction from 'actions/UserAction.jsx';
import { Action } from 'constants/actionType/CurrentUser.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Immutable from 'immutable';
import util from 'util/Util.jsx';

var UserTypeName = null,
  UserType = null;
let CurrentUserAction = {
  getInitData: function(userId) {
    this.getUser(userId);
    UserAction.getCustomerByUser(userId);
    SelectCustomerActionCreator.getCustomer(userId);

  },
  getUser: function(userId) {
    var that = this;
    Ajax.post('/User/GetUsersByFilter', {
      params: {
        filter: {
          UserIds: [userId]
        }
      },
      success: function(userList) {
        UserTypeName = userList[0].UserTypeName;
        UserType = userList[0].UserType;
        that.getRoles(userId);
        that.getPrivilege(userList[0].SpId);
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
    Ajax.post('/AccessControl/GetRolesByFilter', {
      params: {
        filter: {
          UserIds: [userId]
        }
      },
      success: function(list) {
        // SelectCustomerActionCreator.getCustomer(userId);
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
  getPrivilege: function(spId) {
    var that = this;
    Ajax.post(`/serviceprovider/getspprivilege/${spId}`, {
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_PRIVILEGE,
          data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  resetPassword: function(passwordDto) {
    Ajax.post('/User/ResetPassword', {
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
    Ajax.post('/User/ModifyProfile', {
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
  startChangePassword(userName,callback){
    Ajax.post(util.replacePathParams('/user/startChangePassword/{userName}', userName), {
      success: function(result) {
        callback(result)
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }
};

module.exports = CurrentUserAction;
