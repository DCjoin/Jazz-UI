import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
import _trim from 'lodash/string/trim';
import _isEmpty from 'lodash/lang/isEmpty';
import _isEqual from 'lodash/lang/isEqual';
import _isArray from 'lodash/lang/isArray';
var _ = {
  trim: _trim,
  isEmpty: _isEmpty,
  isEqual: _isEqual,
  isArray: _isArray
};

import User from '../constants/actionType/User.jsx';

function emptyList() {
  return new List();
}
function emptyMap() {
  return new Map();
}

let _userStatusList = Immutable.List([]),
  _userList = null,
  _userIds = [],
  _allCustomersList = [],
  _allRolesList = [],
  _allUsersList = emptyList();
let SET_USER_STATUS_EVENT = 'setuserstatus',
  SET_USER_LIST_EVENT = 'setuserlist',
  SET_ALL_COSTOMERS_LIST_EVENT = 'setallcostomerslist',
  SET_ALL_ROLES_LIST_EVENT = 'setallroleslist',
  SET_ALL_USERS_LIST_EVENT = 'seralluserslist',
  CHANGE_EVENT = 'change';
var _filterObj = emptyMap();
var _updatingFilterObj = emptyMap();

var UserStore = assign({}, PrototypeStore, {
  setUserStatus: function(user, status) {
    if (status) {
      _userStatusList = _userStatusList.push(user);
      _userIds.push(user.get('Id'));
    } else {
      let index = _userStatusList.findIndex(item => item.get('Id') == user.get('Id'));
      _userStatusList = _userStatusList.delete(index);
      _userIds.splice(index, 1);
    }
  },
  setUserStatusByAllCheck: function(status) {
    _userStatusList = Immutable.List([]);
    _userIds = [];
    if (status) {
      _userList.forEach(function(user) {
        _userStatusList = _userStatusList.push(user);
        _userIds.push(user.get('Id'));
      });
    }
  },
  getUserStatus: function() {
    return _userStatusList;
  },
  getUserIds: function() {
    return _userIds;
  },
  setUserList: function(userList) {
    _userList = userList;
  },
  getUserList: function() {
    return _userList;
  },
  resetUserList: function() {
    _userStatusList = Immutable.List([]);
    _userList = null;
    _userIds = [];
  },
  //for user-manage
  setAllCostomers: function(customersList) {
    _allCustomersList = [];
    customersList.forEach(
      customer => {
        _allCustomersList[customer.Id] = customer.Name;
      }
    );
  //  _allCustomersList = customersList;
  },
  getAllCostomers: function() {
    return _allCustomersList;
  },
  setAllRoles: function(rolesList) {
    _allRolesList = rolesList;
  },
  getAllRoles: function() {
    return _allRolesList;
  },
  setAllUsers: function(usersList) {
    usersList.forEach(user => {
      if (user.CustomerIds.length == 1 && user.CustomerIds[0] == 0) {
        user.HasWholeCustomer = true;
      } else {
        user.HasWholeCustomer = false;
        user.Customers = [];
        user.CustomerIds.forEach(customerId => {
          user.Customers.push({
            CustomerName: _allCustomersList[customerId]
          });
        });
      }
    });
    _allUsersList = Immutable.fromJS(usersList);
  },
  getAllUsers: function() {
    return _allUsersList;
  },
  getFilterUsers: function() {
    var {realName, displayName, selectedCusomer, role} = _filterObj.toJS();

    realName = _.trim(realName).toLowerCase();
    displayName = _.trim(displayName).toLowerCase();

    if (!this.getAllUsers()) {
      return this.getAllUsers();
    }
    return this.getAllUsers().filter((item) => {

      let curRealName = _.trim(item.get("RealName")).toLowerCase(),
        curDisplayName = _.trim(item.get("Name")).toLowerCase(),
        curCustomers = item.get("Customers"),
        curRole = item.get("UserType");
      if (!_.isEmpty(realName)) {
        if (curRealName.indexOf(realName) < 0) {
          return false;
        }
      }
      if (!_.isEmpty(displayName)) {
        if (curDisplayName.indexOf(displayName) < 0) {
          return false;
        }
      }
      if (selectedCusomer) {

        var hasCustomer = false;
        if (_.isEqual(-2, selectedCusomer)) {
          return item.get("HasWholeCustomer");
        } else if (_.isEqual(-1, selectedCusomer)) {
          return curCustomers.size === 0;
        } else if (curCustomers.size > 0) {
          // if( curCustomers.get(arraySelectedIndex) ) {
          // 	hasCustomer = true;
          // }
          if (curCustomers.findIndex(cus => {
              return cus.get("CustomerId") == selectedCusomer
              }, -1) >= 0) {
              hasCustomer = true;
            }
          }
          if (!hasCustomer) {
            return hasCustomer;
          }
        }
        if (!_.isEmpty(_.trim(role))) {
          if (role != curRole) {
            return false;
          }
        }

        return true;
      });
    },
    merge: function(plainObj, data) {

      if (_.isEmpty(data)) {
        plainObj = emptyMap();
        return plainObj;
      }

      var {status, path, value, index} = data,
        paths = _.isArray(path) ? path : path.split("."),
        value = Immutable.fromJS(value);
      if (status === dataStatus.DELETED) {
        plainObj = plainObj.deleteIn(path);
      } else if (status === dataStatus.NEW) {
        var children = plainObj.getIn(paths);
        if (!children) {
          children = emptyList();
        }
        if (Immutable.List.isList(children)) {
          if (index) {
            paths.push(index);
          } else {
            value = children.push(value);
          }
        }
        plainObj = plainObj.setIn(paths, value);
      } else {
        plainObj = plainObj.setIn(paths, value);
      }
      return plainObj;

    },
    getFilterObj: function() {
      return _updatingFilterObj;
    },

    setFilterObj: function() {
      _filterObj = _updatingFilterObj;
    },
    mergeFilterObj: function() {
      _updatingFilterObj = this.merge(_updatingFilterObj, data);
    },
    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    },

    emitChange(args) {
      this.emit(CHANGE_EVENT, args);
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
    emitAllCostomersListChange: function() {
      this.emit(SET_ALL_COSTOMERS_LIST_EVENT);
    },
    addAllCostomersListListener: function(callback) {
      this.on(SET_ALL_COSTOMERS_LIST_EVENT, callback);
    },
    removeAllCostomersListListener: function(callback) {
      this.removeListener(SET_ALL_COSTOMERS_LIST_EVENT, callback);
      this.dispose();
    },
    emitAllRolesListChange: function() {
      this.emit(SET_ALL_ROLES_LIST_EVENT);
    },
    addAllRolesListListener: function(callback) {
      this.on(SET_ALL_ROLES_LIST_EVENT, callback);
    },
    removeAllRolesListListener: function(callback) {
      this.removeListener(SET_ALL_ROLES_LIST_EVENT, callback);
      this.dispose();
    },
    emitAllUsersListChange: function() {
      this.emit(SET_ALL_USERS_LIST_EVENT);
    },
    addAllUsersListListener: function(callback) {
      this.on(SET_ALL_USERS_LIST_EVENT, callback);
    },
    removeAllUsersListListener: function(callback) {
      this.removeListener(SET_ALL_USERS_LIST_EVENT, callback);
      this.dispose();
    },
  });
  var UserAction = User.Action;

  UserStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
      case UserAction.SET_USER_STATUS:
        UserStore.setUserStatus(action.user, action.status);
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
      case UserAction.GET_ALL_COSTOMERS_LIST:
        UserStore.setAllCostomers(action.customersList);
        UserStore.emitAllCostomersListChange();
        break;
      case UserAction.GET_ALL_ROLES_LIST:
        UserStore.setAllRoles(action.rolesList);
        UserStore.emitAllRolesListChange();
        break;
      case UserAction.GET_ALL_USERS_LIST:
        UserStore.setAllUsers(action.usersList);
        UserStore.emitChange(_allUsersList.getIn([0, "Id"]));
        break;
      case UserAction.MERGE_FILTER_OBJ:
        UserStore.mergeFilterObj(action.usersList);
        UserStore.emitChange();
        break;
      case UserAction.RESET_FILTER:
        _filterObj = emptyMap();
        _updatingFilterObj = emptyMap();
        if (UserStore.getFilterUsers().size > 0) {
          UserStore.emitChange(UserStore.getFilterUsers().first().get("Id"));
        } else {
          UserStore.emitChange();
        }
        break;
    }


  });
  module.exports = UserStore;
