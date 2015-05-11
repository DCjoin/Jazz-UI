import PopAppDispatcher from '../../dispatcher/PopAppDispatcher.jsx';
import DeviceDataMonitorActionType from '../../constants/actionType/DeviceDataMonitor.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
let {Action} = DeviceDataMonitorActionType;
var _data = [];
var _configData = [];
var _configItems = [];
var _groupItems = [];
var _dataDash = [1];
var _sameTypeDevices = [];

var _historicalItems = [];
var _navigatorItems = [];

let CHANGE_EVENT = 'historical_change';

var DeviceDataMonitorStore = assign({}, PrototypeStore, {
  initData: function(devData) {
    _data = devData.data;
  },

  initConfigData: function(config) {
    var configData = config.data.map((node) => {
      return assign(node, {
        GroupId: node.Name
      });
    });
    _configData = configData.filter((node) => {
      return (node.Name && node.Name.trim() !== "" && node.Name != "undefined");
    });
    var configItemsGroup = configData.filter((node) => {
      return !(node.Name && node.Name.trim() !== "" && node.Name != "undefined");
    });
    _configItems = configItemsGroup[0].MonitorParameters;
  },

  initGroupItems: function (Id) {
    var selectedItems = [];
    _configData.forEach(function(node, i){
      if(Id == node.GroupId){
        selectedItems = node.Items;
      }
    });
    _groupItems = _configItems.map(function(item, i){
      var groupItem = {selected: false};
      selectedItems.forEach(function(node, i){
        if(item.Id == node.Id) {
          groupItem = assign({}, groupItem, item, {
            selected: true
          });
        }
      });
      groupItem = assign({}, groupItem, item);
      return groupItem;
    });
  },

  initSameTypeDevices: function (devices) {
    _sameTypeDevices = devices;
  },

  initDataDash: function (dataDash) {
    _dataDash = dataDash;
  },

  setHistoricalItems: function(historicalItems) {
    _historicalItems = historicalItems;
  },

  initNavigatorItems: function(navigatorItems) {
    _navigatorItems = navigatorItems;
  },

  getData: function () {
    return _data;
  },

  getConfData: function () {
    return _configData;
  },

  getSameTypeDevices: function () {
    return _sameTypeDevices;
  },

  getConfItems: function() {
    return _configItems;
  },

  getDataDash: function () {
    return _dataDash;
  },

  getSelectedItems: function (Id) {
    return _groupItems;
  },

  getHistoricalItems: function() {
    return _historicalItems;
  },

  getNavigatorItems: function() {
    return _navigatorItems;
  },

  emitHistoricalChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addHistoricalChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeHistoricalChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

});

DeviceDataMonitorStore.dispatchToken = PopAppDispatcher.register(function(action) {
  switch(action.type){
    case Action.GET_ALL_DATA:
      DeviceDataMonitorStore.initData(action.data);
      DeviceDataMonitorStore.emitChange();
      break;
    case Action.GET_ALL_CONF_DATA:
      DeviceDataMonitorStore.initConfigData(action.data);
      DeviceDataMonitorStore.emitChange();
      break;
    case Action.GET_SAME_DEVICES:
      DeviceDataMonitorStore.initSameTypeDevices(action.data);
      DeviceDataMonitorStore.emitChange();
      break;
    case Action.GET_DASHBOARD_CONFIG:
      DeviceDataMonitorStore.initDataDash(action.data);
      DeviceDataMonitorStore.emitChange();
      break;
    case Action.GET_HISTORIAL_DATA:
      DeviceDataMonitorStore.setHistoricalItems(action.data.ParameterData);
      if(action.data.NavigatorData) {
        DeviceDataMonitorStore.initNavigatorItems(action.data.NavigatorData);
      }
      DeviceDataMonitorStore.emitHistoricalChange();
      break;
    default:
  }

});

module.exports = DeviceDataMonitorStore;
