'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/CurrentUser.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
let CurrentUserAction = {
  getUser: function(userId) {
    Ajax.post('/User.svc/GetUsersByFilter', {
      params: {
        filter: {
          UserIds: [userId]
        }
      },
      success: function(userList) {

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
  resetPassword: function(passwordDto) {
    Ajax.post('/User.svc/ResetPassword', {
      params: {
        dto: passwordDto
      },
      commonErrorHandling: false,
      success: function() {
        AppDispatcher.dispatch({
          type: Action.PASSWORD_SUCCESS,
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
