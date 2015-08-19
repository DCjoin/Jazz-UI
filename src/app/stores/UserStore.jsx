import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List,updater,update,Map} from 'immutable';

import User from '../constants/actionType/User.jsx';

let _userStatusList=Immutable.List([]),
    _userList=null,
    _userIds=[];
let SET_USER_STATUS_EVENT='setuserstatus',
    SET_USER_LIST_EVENT;

var UserStore = assign({},PrototypeStore,{
  setUserStatus:function(user,status){
    if(status){
    _userStatusList=_userStatusList.push(user);
    _userIds.push(user.get('Id'))
    }
    else {
      let index=_userStatusList.findIndex(item=>item.get('Id')==user.get('Id'));
      _userStatusList=_userStatusList.delete(index);
      _userIds.splice(index,1)
    }
  },
  setUserStatusByAllCheck:function(status){
    _userStatusList=Immutable.List([]);
    _userIds=[];
    if(status){
      _userList.forEach(function(user){
        _userStatusList=_userStatusList.push(user);
        _userIds.push(user.get('Id'));
      });
    }
  },
  getUserStatus:function(){
    return _userStatusList;
  },
  getUserIds:function(){
    return _userIds;
  },
  setUserList:function(userList){
    _userList=userList;
  },
  getUserList:function(){
    return _userList;
  },
  resetUserList:function(){
     _userStatusList=Immutable.List([]);
        _userList=null;
        _userIds=[];
  },
  emitUserStatusChange: function() {
              this.emit(SET_USER_STATUS_EVENT);
  },
  addUserStatusListener: function(callback) {
             this.on(SET_USER_STATUS_EVENT, callback);
  },
  removeUserStatusListener: function(callback) {
            this.removeListener(SET_USER_STATUS_EVENT, callback);
            this.dispose();
  },
  emitUserListChange: function() {
              this.emit(SET_USER_LIST_EVENT);
  },
  addUserListListener: function(callback) {
             this.on(SET_USER_LIST_EVENT, callback);
  },
  removeUserListListener: function(callback) {
            this.removeListener(SET_USER_LIST_EVENT, callback);
            this.dispose();
  },
});
var UserAction = User.Action;

UserStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case UserAction.SET_USER_STATUS:
         UserStore.setUserStatus(action.user,action.status);
         UserStore.emitUserStatusChange();
      break;
    case UserAction.LOAD_USER_LIST:
      UserStore.setUserList(action.userList);
      UserStore.emitUserListChange();
      break;
  case UserAction.SET_ALL_USERS_STATUS:
      UserStore.setUserStatusByAllCheck(action.status);
      UserStore.emitUserStatusChange();
      break;
  case UserAction.RESET_USER_LIST:
      UserStore.resetUserList();
      break;
    }
  });
  module.exports = UserStore;
