import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Map } from 'immutable';
import Hierarchy from '../../constants/actionType/hierarchySetting/Hierarchy.jsx';

function emptyMap() {
  return new Map();
}
var _hierarchys = emptyMap(),
  _selectedNode = null,
  _customer = emptyMap();
let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange',
  CUSTOMER_CHANGE_EVENT = 'customerchange';
var HierarchyStore = assign({}, PrototypeStore, {
  setHierarchys: function(hierarchys) {
    _hierarchys = Immutable.fromJS(hierarchys);
  },
  getHierarchys: function() {
    return _hierarchys
  },
  setSelectedNode: function(selectedNode) {
    if (selectedNode.get('Type') !== -1) {
      _customer = emptyMap();
    }
    _selectedNode = selectedNode;
  },
  getSelectedNode: function() {
    return _selectedNode;
  },
  getDropDownMenuItemsByType: function(type) {
    var items = null;
    switch (type) {
      case -1:
      case 0: items = [I18N.Common.Glossary.Organization, I18N.Common.Glossary.Site, I18N.Common.Glossary.Building];
        break;
      case 1: items = [I18N.Common.Glossary.Building];
        break;
    }
    return items
  },
  getParent: function(node) {
    var parent;
    var f = function(item) {
      if (item.get('Id') == node.get('ParentId')) {
        parent = item;
      } else {
        if (item.get('Children')) {
          item.get('Children').forEach(child => {
            f(child)
          })
        }
      }
    };
    f(_hierarchys);
    return parent;
  },
  getAddBtnStatusByNode: function(node) {
    var that = this;
    if (node.get('Type') === 0 || node.get('Type') === 3) {
      let sum = 1;
      let parent = that.getParent(node);
      while (parent.get('Type') === node.get('Type')) {
        sum++;
        parent = that.getParent(parent);
      }
      if (sum >= 5) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  //for customer
  setSelectedCustomer: function(customer) {
    _customer = Immutable.fromJS(customer[0]);
  },
  getSelectedCustomer: function() {
    return _customer;
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
    this.on(ERROR_CHANGE_EVENT, callback);
  },

  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },

  emitErrorhange(args) {
    this.emit(ERROR_CHANGE_EVENT, args);
  },
  addCustomerChangeListener(callback) {
    this.on(CUSTOMER_CHANGE_EVENT, callback);
  },
  removeCustomerChangeListener(callback) {
    this.removeListener(CUSTOMER_CHANGE_EVENT, callback);
  },
  emitCustomerChange(args) {
    this.emit(CUSTOMER_CHANGE_EVENT, args);
  },
});
var HierarchyAction = Hierarchy.Action;
HierarchyStore.dispatchToken = AppDispatcher.register(function(action) {

  switch (action.type) {
    case HierarchyAction.GET_HIERARCHY_TREE_DTOS:
      var pre = _hierarchys;
      HierarchyStore.setHierarchys(action.hierarchys);
      if (pre.size === 0) {
        HierarchyStore.setSelectedNode(_hierarchys);
        HierarchyStore.emitChange(_hierarchys);
      } else {
        HierarchyStore.setSelectedNode(_selectedNode);
        HierarchyStore.emitChange(_selectedNode);
      }
      HierarchyStore.emitChange();
      break;
    case HierarchyAction.SET_SELECTED_HIERARCHY_NODE:
      HierarchyStore.setSelectedNode(action.node);
      break;
    case HierarchyAction.GET_CUSTOMER_FOR_HIERARCHY:
      HierarchyStore.setSelectedCustomer(action.customer);
      HierarchyStore.emitCustomerChange();
      break;

  }
});

module.exports = HierarchyStore;
