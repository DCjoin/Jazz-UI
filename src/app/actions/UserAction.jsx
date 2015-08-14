'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/User.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
let UserAction = {
  getUserList:function(ExcludeId,CustomerId){
    Ajax.post('/User.svc/GetUsersByFilter', {
     params: {
       filter:{
         ExcludeId:ExcludeId,
         CustomerId:CustomerId
       }
      },
    success: function(userList){

      AppDispatcher.dispatch({
          type: Action.LOAD_USER_LIST,
          userList: Immutable.fromJS(userList)
      });
    },
    error: function(err, res){
      console.log(err,res);
    }
  });
  },
  setUserStatus(user,status){
    AppDispatcher.dispatch({
        type: Action.SET_USER_STATUS,
        user: user,
        status:status
    });
  },
  setUsersStatusByAllCheck(status){
  AppDispatcher.dispatch({
      type: Action.SET_ALL_USERS_STATUS,
      status:status
  });
  },
};

module.exports = UserAction;
