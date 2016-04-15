import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Map, List } from 'immutable';
import Hierarchy from '../../constants/actionType/hierarchySetting/Hierarchy.jsx';

function emptyMap() {
  return new Map();
}
function emptyList() {
  return new List();
}
var _hierarchys = emptyMap(),
  _selectedNode = null,
  _logList = emptyList(),
  _tagList = null,
  _total = null,
  _customer = emptyMap();
let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange',
  CUSTOMER_CHANGE_EVENT = 'customerchange',
  CHANGE_LOG_EVENT = 'changelog';
var HierarchyStore = assign({}, PrototypeStore, {
  traversalNode: function(node) {
    var f = function(item) {
      if (item.Children === null || item.HasChildren === false) {
        if (item.Type === 101) {
          item.Id = 0 - item.Id
        }
        return
      } else {
        if (item.Type === 101) {
          item.Id = 0 - item.Id
        }
        item.Children.forEach(el => {
          f(el)
        })
      }
    };
    f(node);
    return node;
  },
  setHierarchys: function(hierarchys) {
    _hierarchys = Immutable.fromJS(this.traversalNode(hierarchys));
  },
  getHierarchys: function() {
    return _hierarchys;
  },
  setLogList(logList) {
    if (logList) {
      _logList = Immutable.fromJS(logList);
    }
  },
  getLogList() {
    return _logList;
  },
  //tag
  setTagList: function(data) {
    _total = data.total;
    _tagList = Immutable.fromJS(data.GetVEETagsByFilterResult);
  },
  getTagList: function() {
    return _tagList;
  },
  getTotal: function() {
    return _total;
  },
  findCommodityById: function(id) {
    var commodities = Immutable.fromJS(window.allCommodities),
      filter = commodities.find(item => (item.get('Id') === id));
    return (filter.get('Comment'));
  },
  findUOMById: function(id) {
    var uoms = Immutable.fromJS(window.uoms),
      filter = uoms.find(item => (item.get('Id') === id));
    return (filter.get('Comment'));
  },
  ifEmitTagChange: function() {
    var that = this;
    if (_tagList !== null & !!window.allCommodities && !!window.uoms) {
      that.emitTagChange();
    }
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
      case 0:
        items = [I18N.Common.Glossary.Organization, I18N.Common.Glossary.Site, I18N.Common.Glossary.Building];
        break;
      case 1:
        items = [I18N.Common.Glossary.Building];
        break;
    }
    return items;
  },
  getParent: function(node) {
    var parent;
    var f = function(item) {
      if (item.get('Id') == node.get('ParentId')) {
        parent = item;
      } else {
        if (item.get('Children')) {
          item.get('Children').forEach(child => {
            f(child);
          });
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
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  //for customer
  setSelectedCustomer: function(customer) {
    _customer = Immutable.fromJS(customer[0]);
  },
  getSelectedCustomer: function() {
    return _customer;
  },
  findNextSelectedNode: function(dto) {
    var node = Immutable.fromJS(dto),
      parent = this.getParent(node),
      children = parent.get('Children'),
      selectedNode = null;
    var index = children.findIndex(item => item.get('Id') == node.get('Id'))
    if (children.size === 1) {
      selectedNode = parent;
    } else {
      if (index == children.size - 1) {
        selectedNode = children.find((item, i) => (i == index - 1));
      } else {
        selectedNode = children.find((item, i) => (i == index + 1));
      }

    }
    return selectedNode
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
  emitLogListChange: function() {
    this.emit(CHANGE_LOG_EVENT);
  },
  addLogListChangeListener: function(callback) {
    this.on(CHANGE_LOG_EVENT, callback);
  },
  removeLogListChangeListener: function(callback) {
    this.removeListener(CHANGE_LOG_EVENT, callback);
  },
});
var HierarchyAction = Hierarchy.Action,
  MainAction = Main.Action;
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
    case HierarchyAction.GET_LOG_LIST_SUCCESS:
      HierarchyStore.setLogList(action.logList);
      HierarchyStore.emitLogListChange();
      break;
    case HierarchyAction.GET_LOG_LIST_ERROR:
      HierarchyStore.setLogList([]);
      HierarchyStore.emitLogListChange();
      break;
    case HierarchyAction.GET_ASSOCIATED_TAG:
      HierarchyStore.setTagList(action.data);
      HierarchyStore.ifEmitTagChange();
      break;
    case MainAction.GET_ALL_UOMS_SUCCESS:
      HierarchyStore.ifEmitTagChange();
      break;
    case MainAction.GET_ALL_COMMODITY_SUCCESS:
      HierarchyStore.ifEmitTagChange();
      break;
    case HierarchyAction.SAVE_ASSOCIATED_TAG_SUCCESS:
      HierarchyStore.emitChange(_selectedId);
      break;
    case HierarchyAction.CLEAR_ALL_ASSOCIATED_TAGS:
      HierarchyStore.clearAll();
      break;
    case HierarchyAction.DELETE_HIERARCHY_DTO_SUCCESS:
      HierarchyStore.setSelectedNode(action.nextSelectedNode);
      break;
    case HierarchyAction.HIERARCHY_ERROR:
      HierarchyStore.emitErrorhange({
        title: action.title,
        content: action.content
      });
      break;

  }
});

module.exports = HierarchyStore;
