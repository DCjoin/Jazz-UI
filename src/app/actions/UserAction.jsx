'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/User.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
let UserAction = {
  getUserList: function(ExcludeId, CustomerId) {
    Ajax.post('/User.svc/GetUsersByFilter', {
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
    Ajax.post('/Customer.svc/GetCustomersByFilter', {
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
    Ajax.post('/AccessControl.svc/GetRolesByFilter', {
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
    Ajax.post('/User.svc/GetUsersByFilter', {
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
  mergeFilterObj(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_FILTER_OBJ,
      data: data
    });
  },
};

module.exports = UserAction;
