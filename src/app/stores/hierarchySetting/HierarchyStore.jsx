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
  _selectedNode = null;
let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange';
var HierarchyStore = assign({}, PrototypeStore, {
  setHierarchys: function(hierarchys) {
    _hierarchys = Immutable.fromJS(hierarchys);
  },
  getHierarchys: function() {
    return _hierarchys
  },
  setSelectedNode: function(selectedNode) {
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

  }
});

module.exports = HierarchyStore;
