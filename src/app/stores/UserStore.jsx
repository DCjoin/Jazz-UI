import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
import { dataStatus } from '../constants/DataStatus.jsx';
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
  _allCustomers = [],
  _allRolesList = [],
  _allUsersList = emptyList(),
  _selectedId = null;
let SET_USER_STATUS_EVENT = 'setuserstatus',
  SET_USER_LIST_EVENT = 'setuserlist',
  SET_ALL_COSTOMERS_LIST_EVENT = 'setallcostomerslist',
  SET_ALL_ROLES_LIST_EVENT = 'setallroleslist',
  SET_ALL_USERS_LIST_EVENT = 'seralluserslist',
  CHANGE_EVENT = 'change',
  CHANGE_CUSTOMER_PERMISSION_EVENT = 'changecustomerpermission';
var _filterObj = emptyMap();
var _updatingFilterObj = emptyMap();
var _persistedUser = emptyMap();
var _updatingUser = emptyMap();
var _userCustomers = emptyMap();
var _updatingUserCustomers = emptyMap();

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
    _allCustomersList = customersList;
    _allCustomers = [];
    customersList.forEach(
      customer => {
        _allCustomers[customer.Id] = customer.Name;
      }
    );
  //  _allCustomersList = customersList;
  },
  getAllCostomers: function() {
    return Immutable.fromJS(_allCustomersList);
  },
  setAllRoles: function(rolesList) {
    _allRolesList = rolesList;
  },
  getAllRoles: function() {
    return Immutable.fromJS(_allRolesList);
  },
  setAllUsers: function(usersList) {
    usersList.forEach(user => {
      if (user.CustomerIds.length == 1 && user.CustomerIds[0] == 0) {
        user.HasWholeCustomer = true;
        user.Customers = [];
        _allCustomersList.forEach(customer => {
          user.Customers.push({
            CustomerName: customer.Name,
            CustomerId: customer.Id,
          });
        });
      } else {
        user.HasWholeCustomer = false;
        user.Customers = [];
        user.CustomerIds.forEach(customerId => {
          user.Customers.push({
            CustomerName: _allCustomers[customerId],
            CustomerId: customerId,
          });
        });
      }
    });
    _allUsersList = Immutable.fromJS(usersList);
  //this.setUserCustomers(usersList[0].Customers);
  },
  getUser: function(Id, view) {

    if (_updatingUser.get("Id") != Id) {
      _updatingUser = emptyMap();
      if (_allUsersList && _allUsersList.size > 0) {
        var filterUser = _allUsersList.filter(item => item.get("Id") == Id);

        if (filterUser.size > 0) {
          _persistedUser = _updatingUser = filterUser.first();
        }
      }
    }
    if (view) {
      return _persistedUser;
    } else {
      return _updatingUser;
    }
  },
  getPersistedUser: function() {
    return _persistedUser;
  },
  getUpdatingUser: function() {
    return _updatingUser;
  },
  setUser: function(user) {
    _updatingUser = _persistedUser = Immutable.fromJS(user);
  },
  getAllUsers: function() {
    return _allUsersList;
  },
  setCurrentSelectedId: function(id) {
    _selectedId = id;
    var filterUser = _allUsersList.filter(item => item.get("Id") == id);
  //this.setUserCustomers(filterUser.get('Customers').toJS());
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
    setCustomerDataPrivilege(dataPrivilege) {
      var findIndex = -1;
      this.getUpdatingUserCustomers().every((customer, index) => {
        if (dataPrivilege.CustomerId === customer.get("CustomerId")) {
          findIndex = index;
        }
        return findIndex === -1;
      });
      if (findIndex !== -1) {
        this.setUpdateUserCustomers(this.getUpdatingUserCustomers().setIn([findIndex, "dataPrivilege"], Immutable.fromJS(dataPrivilege)));
      }
    // this.getUserCustomer(dataPrivilege.CustomerId).set("dataPrivilege", dataPrivilege);
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
    mergeUser: function(data) {
      _updatingUser = this.merge(_updatingUser, data);
    },
    // Customers
    getUserCustomers() {
      return _userCustomers;
    },
    getUpdatingUserCustomers() {
      return _updatingUserCustomers;
    },

    setUserCustomers(userCustomers) {
      var customers = [];
      if (!!userCustomers.WholeSystem) {
        userCustomers.Privileges.forEach(privilege => {
          var pri = privilege;
          pri.Privileged = true;
          pri.WholeCustomer = true;
          customers.push(pri);
        });
      } else {
        customers = userCustomers.Privileges;
      }
      _userCustomers = _updatingUserCustomers = Immutable.fromJS(customers);
    },

    setUpdateUserCustomers(userCustomers) {
      _updatingUserCustomers = Immutable.fromJS(userCustomers);
    },
    getUserCustomer(customerId, view) {
      return this.getUpdatingUserCustomers().find(customer => {
          return customerId === customer.get("CustomerId");
        }) || {};
    },
    mergeCustomer: function(data) {
      _updatingUserCustomers = this.merge(_updatingUserCustomers, data);
    },
    getFilterObj: function() {
      return _updatingFilterObj;
    },

    setFilterObj: function() {
      _filterObj = _updatingFilterObj;
    },
    mergeFilterObj: function(data) {
      _updatingFilterObj = this.merge(_updatingFilterObj, data);
    },
    resetFilterObj: function() {
      _updatingFilterObj = _filterObj;
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
    addChangeCustomerPermissionListener(callback) {
      this.on(CHANGE_CUSTOMER_PERMISSION_EVENT, callback);
    },

    removeChangCustomerPermissionListener(callback) {
      this.removeListener(CHANGE_CUSTOMER_PERMISSION_EVENT, callback);
    },

    emitChangeCustomerPermission() {
      this.emit(CHANGE_CUSTOMER_PERMISSION_EVENT);
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
        UserStore.mergeFilterObj(action.data);
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
      case UserAction.SET_FILTER_OBJ:
        UserStore.setFilterObj();
        if (UserStore.getFilterUsers().size > 0) {
          UserStore.emitChange(UserStore.getFilterUsers().first().get("Id"));
        } else {
          UserStore.emitChange();
        }
        break;
      case UserAction.RESET_FILTER_OBJ:
        UserStore.resetFilterObj();
        UserStore.emitChange();
        break;
      case UserAction.SET_CURRENT_SELECTED_ID:
        UserStore.setCurrentSelectedId(action.id);
        break;
      case UserAction.MERGE_USER_CUSTOMER:
        UserStore.mergeCustomer(action.data);
        UserStore.emitChange();
        break;
      case UserAction.GET_CUSTOMER_BY_USER:
        UserStore.setUserCustomers(action.data);
        UserStore.emitChange();
        break;
      case UserAction.GET_CUSTOMER_PERMISSION_BY_USER:
        if (action.data) {
          UserStore.setCustomerDataPrivilege(action.data);
        } else {
          UserStore.setCustomerDataPrivilege({
            CustomerId: action.customerId,
            Children: []
          });
        }
        UserStore.emitChangeCustomerPermission();
        break;
    }


  });
  module.exports = UserStore;
