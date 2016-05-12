import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { Map, List } from 'immutable';
import Hierarchy from '../../constants/actionType/hierarchySetting/Hierarchy.jsx';
import Main from '../../constants/actionType/Main.jsx';
import AllCommodityStore from '../AllCommodityStore.jsx';
import moment from "moment";

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
  _customer = emptyMap(),
  _calendar = null,
  _property = null,
  _allCalendar = null,
  _industries = null,
  _zones = null,
  _cost = emptyMap(),
  _costError = false;
let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange',
  CUSTOMER_CHANGE_EVENT = 'customerchange',
  LOG_CHANGE_EVENT = 'logchange',
  CALENDAR_CHANGE_EVENT = 'calendarchange',
  ALL_CALENDAR_CHANGE_EVENT = 'allcalendarchange',
  PROPERTY_CHANGE_EVENT = 'propertychange',
  COST_CHANGE_EVENT = 'costchange',
  TAG_CHANGE_EVENT = 'tagchange';
var HierarchyStore = assign({}, PrototypeStore, {
  traversalNode: function(node) {
    var f = function(item) {
      if (item.Children === null || item.HasChildren === false) {
        if (item.Type === 101) {
          item.Id = 0 - item.Id;
        }
        return;
      } else {
        if (item.Type === 101) {
          item.Id = 0 - item.Id;
        }
        item.Children.forEach(el => {
          f(el);
        });
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
    _tagList = Immutable.fromJS(data.Data);
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
  findUOMIdById: function(id) {
    switch (id) {
      case 1:
      case 8:
      case 9: return 1;
      case 3:
      case 6:return 5;
      default:return 9;
    }
  },
  setTagEnergyConsumption: function(tag) {
    var newTag = Immutable.fromJS(tag[0]);
    var index = _tagList.findIndex(item => (item.get('Id') === newTag.get('Id')));
    if (index !== -1) {
      _tagList = _tagList.set(index, newTag);
    }
  },
  ifEmitCalendarChange: function() {
    var that = this;
    if (_calendar !== null && _allCalendar !== null) {
      that.emitCalendarChange();
    }
  },
  ifEmitTagChange: function() {
    var that = this;
    if (_tagList !== null & !!window.allCommodities && !!window.uoms) {
      that.emitTagChange();
    }
  },
  ifEmitCostChange: function() {
    var that = this;
    if (_cost.size !== 0 && !!window.uoms) {
      that.emitCostChange();
    }
  },
  setAllCalendar: function(calendar) {
    _allCalendar = Immutable.fromJS(calendar);
  },
  getAllCalendar: function() {
    return _allCalendar;
  },
  setCalendar: function(calendar) {
    _calendar = Immutable.fromJS(calendar);
  },
  getCalendar: function() {
    return _calendar;
  },
  setProperty: function(property) {
    _property = Immutable.fromJS(property);
  },
  getProperty: function() {
    return _property;
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
  getTabSumByType: function(type) {
    switch (type) {
      case -1:
      case 0:
      case 1:
        return 3;
        break;
      case 2:
        return 5;
        break;
      case 101:
        return 2;
        break;
    }
  },
  getNameByType: function(type) {
    var typeArr = [I18N.Common.Glossary.Organization, I18N.Common.Glossary.Site, I18N.Common.Glossary.Building];
    typeArr[101] = I18N.Common.Glossary.Dim;
    return typeArr[type];
  },
  getNodeById: function(id) {
    var node;
    var f = function(item) {
      if (item.get('Id') == id) {
        node = item;
      } else {
        if (item.get('Children')) {
          item.get('Children').forEach(child => {
            f(child);
          });
        }
      }
    };
    f(_hierarchys);
    return node;
  },
  getParent: function(node) {
    var parent;
    var f = function(item) {
      if (item.get('Id') == node.get('ParentId') || (node.get('ParentType') === 101 && item.get('Id') == -node.get('ParentId'))) {
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
  getPreNode: function(node, parentNode) {
    var children = parentNode.get('Children'),
      index = children.findIndex(item => item.get('Id') === node.get('Id'));
    if (index === 0) {
      return null;
    } else {
      return children.getIn([index - 1]);
    }

  },
  getNextNode: function(node, parentNode) {
    var children = parentNode.get('Children'),
      index = children.findIndex(item => item.get('Id') === node.get('Id'));
    if (index === children.size - 1) {
      return null;
    } else {
      return children.getIn([index + 1]);
    }
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
    var index = children.findIndex(item => item.get('Id') == node.get('Id'));
    if (children.size === 1) {
      selectedNode = parent;
    } else {
      if (index == children.size - 1) {
        selectedNode = children.find((item, i) => (i == index - 1));
      } else {
        selectedNode = children.find((item, i) => (i == index + 1));
      }

    }
    return selectedNode;
  },
  setIndustries: function(industries) {
    _industries = industries;
  },
  getAllIndustries: function() {
    return _industries;
  },
  setZones: function(zones) {
    _zones = zones;
  },
  getAllZones: function() {
    return _zones;
  },
  setCost: function(cost) {
    _cost = Immutable.fromJS(cost);
  },
  getCost: function() {
    return _cost;
  },
  getCommodities: function() {
    var items = assign([], AllCommodityStore.getAllCommodities());
    items.shift();
    items.shift();
    items.pop();
    return items;
  },
  checkoutCostErrorMsg: function(cost) {
    _costError = false;
    let power = emptyMap(),
      index = -1;
    var checkPower = function(power, id) {
      let powerLength = power.get('Items').size;
      power.get('Items').forEach((item, index) => {
        cost = cost.setIn(['CostCommodities', id, 'Items', index, 'ErrorMsg'], null);
      })
      for (var i = 0; i <= powerLength - 2; i++)
        for (var j = i + 1; j <= powerLength - 1; j++) {
          var ipowerDate = moment(power.getIn(['Items', i, 'EffectiveDate'])),
            jpowerDate = moment(power.getIn(['Items', j, 'EffectiveDate']));
          if (ipowerDate.get('year') === jpowerDate.get('year') && ipowerDate.get('month') === jpowerDate.get('month')) {
            cost = cost.setIn(['CostCommodities', id, 'Items', i, 'ErrorMsg'], I18N.Common.Label.TimeConflict);
            cost = cost.setIn(['CostCommodities', id, 'Items', j, 'ErrorMsg'], I18N.Common.Label.TimeConflict);
            _costError = true;
          }
      }
    };
    var checkOthers = function() {
      let coLength = cost.get('CostCommodities').size;
      cost.get('CostCommodities').forEach((co, index) => {
        if (co.get('CommodityId') !== 1) {
          cost = cost.setIn(['CostCommodities', index, 'Items', 0, 'ErrorMsg'], null);
        }
      });
      for (var i = 0; i <= coLength - 2; i++)
        for (var j = i + 1; j <= coLength - 1; j++) {
          if (cost.getIn(['CostCommodities', i, 'CommodityId']) !== 1 && cost.getIn(['CostCommodities', j, 'CommodityId']) !== 1 &&
            cost.getIn(['CostCommodities', i, 'CommodityId']) === cost.getIn(['CostCommodities', j, 'CommodityId'])) {
            var iotherDate = moment(cost.getIn(['CostCommodities', i, 'Items', 0, 'EffectiveDate'])),
              jotherDate = moment(cost.getIn(['CostCommodities', j, 'Items', 0, 'EffectiveDate']));
            if (iotherDate.get('year') === jotherDate.get('year') && iotherDate.get('month') === jotherDate.get('month')) {
              cost = cost.setIn(['CostCommodities', i, 'Items', 0, 'ErrorMsg'], I18N.Common.Label.TimeConflict);
              cost = cost.setIn(['CostCommodities', j, 'Items', 0, 'ErrorMsg'], I18N.Common.Label.TimeConflict);
              _costError = true;
            }
          }

      }
    };
    if (cost.get('CostCommodities') !== null) {
      power = cost.get('CostCommodities').find(item => (item.get('CommodityId') === 1));
      index = cost.get('CostCommodities').findIndex(item => (item.get('CommodityId') === 1));
      if (index > -1) {
        checkPower(power, index);
      }
      checkOthers();
    }
    return cost;
  },
  getCostErrorStatus: function() {
    return _costError
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
    this.emit(LOG_CHANGE_EVENT);
  },
  addLogListChangeListener: function(callback) {
    this.on(LOG_CHANGE_EVENT, callback);
  },
  removeLogListChangeListener: function(callback) {
    this.removeListener(LOG_CHANGE_EVENT, callback);
  },
  emitCalendarChange: function() {
    this.emit(CALENDAR_CHANGE_EVENT);
  },
  addCalendarChangeListener: function(callback) {
    this.on(CALENDAR_CHANGE_EVENT, callback);
  },
  removeCalendarChangeListener: function(callback) {
    this.removeListener(CALENDAR_CHANGE_EVENT, callback);
  },
  emitPropertyChange: function() {
    this.emit(PROPERTY_CHANGE_EVENT);
  },
  addPropertyChangeListener: function(callback) {
    this.on(PROPERTY_CHANGE_EVENT, callback);
  },
  removePropertyChangeListener: function(callback) {
    this.removeListener(PROPERTY_CHANGE_EVENT, callback);
  },
  addTagChangeListener(callback) {
    this.on(TAG_CHANGE_EVENT, callback);
  },
  removeTagChangeListener(callback) {
    this.removeListener(TAG_CHANGE_EVENT, callback);
  },
  emitTagChange(args) {
    this.emit(TAG_CHANGE_EVENT, args);
  },
  addCostChangeListener(callback) {
    this.on(COST_CHANGE_EVENT, callback);
  },
  removeCostChangeListener(callback) {
    this.removeListener(COST_CHANGE_EVENT, callback);
  },
  emitCostChange(args) {
    this.emit(COST_CHANGE_EVENT, args);
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
        if (action.selectedId) {
          let node = HierarchyStore.getNodeById(action.selectedId);
          HierarchyStore.setSelectedNode(node);
          HierarchyStore.emitChange(node);
        } else {
          HierarchyStore.setSelectedNode(_selectedNode);
          HierarchyStore.emitChange(_selectedNode);
        }

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
      HierarchyStore.ifEmitCostChange();
      break;
    case MainAction.GET_ALL_COMMODITY_SUCCESS:
      HierarchyStore.ifEmitTagChange();
      break;
    case HierarchyAction.CLEAR_ALL_ASSOCIATED_TAGS:
      HierarchyStore.clearAll();
      break;
    case HierarchyAction.DELETE_HIERARCHY_DTO_SUCCESS:
      //HierarchyStore.setSelectedNode(action.nextSelectedNode);
      break;
    case HierarchyAction.HIERARCHY_ERROR:
      HierarchyStore.emitErrorhange({
        title: action.title,
        content: action.content
      });
      break;
    case HierarchyAction.GET_ALL_CALENDARS_FOR_HIERARCHY:
      HierarchyStore.setAllCalendar(action.calendar);
      HierarchyStore.ifEmitCalendarChange();
      break;
    case HierarchyAction.GET_CALENDAR_FOR_HIERARCHY:
    case HierarchyAction.SET_CALENDAR_FOR_HIERARCHY:
      HierarchyStore.setCalendar(action.calendar);
      HierarchyStore.ifEmitCalendarChange();
      break;
    case HierarchyAction.GET_PROPERTY_FOR_HIERARCHY:
    case HierarchyAction.SET_PROPERTY_FOR_HIERARCHY:
      HierarchyStore.setProperty(action.property);
      HierarchyStore.emitPropertyChange();
      break;
    case HierarchyAction.GET_ALL_INDUSTRIES_FOR_HIERARCHY:
      HierarchyStore.setIndustries(action.industries);
      break;
    case HierarchyAction.GET_ALL_ZONES_FOR_HIERARCHY:
      HierarchyStore.setZones(action.zones);
      break;
    case HierarchyAction.SET_ENERGY_CONSUMPTION:
      HierarchyStore.setTagEnergyConsumption(action.tag);
      HierarchyStore.ifEmitTagChange();
      break;
    case HierarchyAction.CANCEL_SAVE_CALENDAR:
      HierarchyStore.emitCalendarChange();
      break;
    case HierarchyAction.CANCEL_SAVE_PROPERTY:
      HierarchyStore.emitPropertyChange();
      break;
    case HierarchyAction.GET_COST_BY_HIERARCHY:
      HierarchyStore.setCost(action.cost);
      HierarchyStore.ifEmitCostChange();
      break;
    case HierarchyAction.SAVE_COST_BY_HIERARCHY_SUCCESS:
      HierarchyStore.emitChange(_selectedNode);
      break;
  }
});

module.exports = HierarchyStore;
