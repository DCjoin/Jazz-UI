'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/User.jsx';
import Ajax from '../ajax/Ajax.jsx';
import Immutable from 'immutable';
import CommonFuns from '../util/Util.jsx';
let UserAction = {
  getUserList: function(ExcludeId, CustomerId) {
    Ajax.post('/User/GetUsersByFilter', {
      params: {
        filter: {
          ExcludeId: ExcludeId,
          CustomerId: CustomerId
        }
      },
      success: function(userList) {
        AppDispatcher.dispatch({
          type: Action.LOAD_USER_LIST,
          userList: Immutable.fromJS(userList)
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getUsersByPrivilegeItem: function(ExcludeUserId, PrivileteItemId) {
    Ajax.post('/AccessControl/GetUsersByPrivilegeItem', {
      params: {
        filter: {
          ExcludeUserId,
          PrivileteItemId,
          PrivilegeType: 0
        }
      },
      success: function(userList) {
        AppDispatcher.dispatch({
          type: Action.LOAD_USER_LIST,
          userList: Immutable.fromJS(userList)
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });

  },
  setUserStatus(user, status) {
    AppDispatcher.dispatch({
      type: Action.SET_USER_STATUS,
      user: user,
      status: status
    });
  },
  setUsersStatusByAllCheck(status) {
    AppDispatcher.dispatch({
      type: Action.SET_ALL_USERS_STATUS,
      status: status
    });
  },
  resetUserList() {
    AppDispatcher.dispatch({
      type: Action.RESET_USER_LIST
    });
  },
  getAllCustomers: function() {
    var that = this;
    Ajax.post('/Customer/GetCustomersByFilter', {
      params: {
        filter: {}
      },
      success: function(customersList) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_COSTOMERS_LIST,
          customersList: customersList
        });
        that.getAllUsers();
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getAllRoles: function() {
    Ajax.post('/AccessControl/GetRolesByFilter', {
      params: {
        filter: {}
      },
      success: function(rolesList) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ROLES_LIST,
          rolesList: rolesList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getAllUsers: function() {
    Ajax.post('/User/GetUsersByFilter', {
      params: {
        filter: {}
      },
      success: function(usersList) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_USERS_LIST,
          usersList: usersList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  resetFilter: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_FILTER,
    });
  },
  resetFilterObj() {
    AppDispatcher.dispatch({
      type: Action.RESET_FILTER_OBJ
    });
  },
  reset: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_USER_AND_CUSTOMER
    });
  },
  setFilterObj() {
    AppDispatcher.dispatch({
      type: Action.SET_FILTER_OBJ
    });
  },
  mergeFilterObj(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_FILTER_OBJ,
      data: data
    });
  },
  setCurrentSelectedId(id) {
    AppDispatcher.dispatch({
      type: Action.SET_CURRENT_SELECTED_ID,
      id: id
    });
  },
  mergeCustomer(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_USER_CUSTOMER,
      data: data
    });
  },
  getCustomerByUser(userId) {
    var that = this;
    Ajax.post('/AccessControl/GetDataPrivilege', {
      params: {
        filter: {
          UserId: userId,
          PrivilegeType: 0
        }
      },
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_CUSTOMER_BY_USER,
          data: data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getUserCustomerPermission: function(userId, customerId, includeArea) {
    Ajax.post('/Hierarchy/GetHierarchyTreeDtosRecursive?', {
      params: {
        customerId: customerId,
        includeArea: includeArea
      },
      success: function(data) {

        AppDispatcher.dispatch({
          type: Action.GET_CUSTOMER_PERMISSION_BY_USER,
          data: data,
          customerId
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  mergeUser(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_USER,
      data: data
    });
  },
  createUserInfo: function(info) {
    var that = this;
    Ajax.post('/User/CreateUser', {
      params: {
        dto: info
      },
      commonErrorHandling: false,
      success: function(data) {
        that.getAllUsers();
        AppDispatcher.dispatch({
          type: Action.MODIFY_USER_SUCCESS,
          data: data,
        });
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.USER_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  updateUserInfo: function(info) {
    var that = this;
    Ajax.post('/User/ModifyUser', {
      params: {
        dto: info
      },
      commonErrorHandling: false,
      success: function(data) {
        that.getAllUsers();
        AppDispatcher.dispatch({
          type: Action.MODIFY_USER_SUCCESS,
          data: data,
        });
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.USER_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  deleteUser(user) {
    Ajax.post('/User/DeleteUser', {
      params: {
        dto: {
          Id: user.Id,
          Version: user.Version
        }
      },
      commonErrorHandling: false,
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.DELETE_USER_SUCCESS,
          selectedId: user.Id
        });
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.USER_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  saveCustomerByUser: function(info) {
    var that = this;
    Ajax.post('/AccessControl/SetDataPrivilege', {
      params: {
        dto: info
      },
      commonErrorHandling: false,
      success: function(data) {
        that.getCustomerByUser(info.UserId);
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.USER_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  resetPassword: function(userId) {
    Ajax.post('/User/SendInitPassword', {
      params: {
        userid: userId
      },
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.SEND_USER_EMAIL_SUCCESS,
          data: data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  clearAll: function() {

    AppDispatcher.dispatch({
      type: Action.CLEAR_ALL_USERS,
    });

  },
};

module.exports = UserAction;
