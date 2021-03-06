import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
import Role from '../constants/actionType/Role.jsx';
import User from '../constants/actionType/User.jsx';
import CurrentUserStore from './CurrentUserStore.jsx';

const DEFAULT_ROLE_TYPE = 102;

function emptyList() {
  return new List();
}
function emptyMap() {
  return new Map();
}
let _roles = [],
  _persistedRole = emptyMap(),
  _updatingRole = emptyMap(),
  _selectedId = null;

let CHANGE_EVENT = 'change',
  Error_CHANGE_EVENT = 'errorchange';
var RoleStore = assign({}, PrototypeStore, {
  setRoleList: function(rolesList) {
    _roles = rolesList;
  },
  setRole: function(role) {
    _persistedRole = _updatingRole = Immutable.fromJS(role);
  },
  getRoleList: function() {
    return _roles;
  },
  getRoleByEnableView: function() {
    return _roles.filter(role => role.RoleType !== DEFAULT_ROLE_TYPE);
  },
  getRole: function(Id) {
    if (!!Id) {
      var filterRole = Immutable.fromJS(this.getRoleByEnableView()).filter(item => item.get("Id") == Id);
      var index = Immutable.fromJS(this.getRoleByEnableView()).findIndex(item => item.get("Id") == Id);
      if (index > -1) {
        _persistedRole = _updatingRole = filterRole.first();
      }

    } else {
      _persistedRole = _updatingRole = emptyMap();
      _updatingRole = _updatingRole.set("PrivilegeCodes", Immutable.fromJS([]));
    }

    return _persistedRole;
  },
  getUpdatingRole: function() {
    return _updatingRole;
  },
  getPersistedRole: function() {
    return _persistedRole;
  },
  setSelectedId: function(id) {
    _selectedId = id;
  },
  mergeRole: function(data) {
    // _updatingRole = this.merge(_updatingRole, data);
    // if (!data) {
    //   _updatingRole = _updatingRole.set("PrivilegeCodes", Immutable.fromJS([]));
    // }
    if (!data) {
      _persistedRole = _updatingRole = emptyMap();
      _updatingRole = _updatingRole.set("PrivilegeCodes", Immutable.fromJS([]));
    } else {
      _updatingRole = _updatingRole.set(data.path, Immutable.fromJS(data.value));
    }

  },
  deleteRole(deletedId) {
    var deletedIndex = -1,
      roles = Immutable.fromJS(this.getRoleByEnableView());

    if (roles.size < 2) {
      roles = emptyList();
      return 0;
    }

    var nextSelectedId = 0;

    roles.every((item, index) => {
      if (item.get("Id") == deletedId) {
        deletedIndex = index;
        if (index == roles.size) {
          nextSelectedId = roles.getIn([roles.size - 1, "Id"]);
        } else {
          nextSelectedId = roles.getIn([index + 1, "Id"]);
        }
        return false;
      }
      return true;
    });
    roles = roles.deleteIn([deletedIndex]);
    _roles = roles.toJS();

    return nextSelectedId;
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
  addErrorChangeListener(callback) {
    this.on(Error_CHANGE_EVENT, callback);
  },

  removeErrorChangeListener(callback) {
    this.removeListener(Error_CHANGE_EVENT, callback);
  },

  emitErrorhange(args) {
    this.emit(Error_CHANGE_EVENT, args);
  },
});
var RoleAction = Role.Action,
  UserAction = User.Action;

RoleStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case UserAction.GET_ALL_ROLES_LIST:
      var pre = _roles;
      RoleStore.setRoleList(action.rolesList);
      if (pre.length === 0) {
        RoleStore.emitChange(_roles[0].Id);
      } else {
        RoleStore.emitChange();
      }
      break;
    case RoleAction.SET_SELECTED_ROLE_ID:
      RoleStore.setSelectedId(action.id);
      RoleStore.emitChange(_roles[0].Id);
      break;
    case RoleAction.MERGE_ROLE:
      RoleStore.mergeRole(action.data);
      RoleStore.emitChange();
      break;
    case RoleAction.CREATE_ROLE:
      RoleStore.setRole(action.role);
      RoleStore.emitChange(action.role.Id);
      break;
    case RoleAction.UPDATE_ROLE:
      RoleStore.setRole(action.role);
      RoleStore.emitChange(action.role.Id);
      break;
    case RoleAction.Delete_ROLE_SUCCESS:
      var selecteId = RoleStore.deleteRole(action.selectedId);
      RoleStore.emitChange(selecteId);
      break;
    case RoleAction.ROLE_ERROR:
      RoleStore.emitErrorhange({
        title: action.title,
        content: action.content
      });
      break;
  }
});
module.exports = RoleStore;
