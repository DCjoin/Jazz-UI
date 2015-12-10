import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import CommonFuns from '../util/Util.jsx';
import Map from '../constants/actionType/Map.jsx';
import _get from 'lodash/object/get';
var _ = {
  get: _get
};

let DATE_MENU_EVENT = 'datemanu',
  MAP_INFO_EVENT = 'mapinfo',
  BUILDING_INFO_EVENT = 'buildinginfo';
let _dateMenu = [],
  _selectDate = null,
  _selectedDateType = null,
  relativeDateType = [1, 2, 5, 6, 7, 8],
  _dateType = ['today', 'yesterday', 'thismonth', 'lastmonth', 'thisyear', 'lastyear'],
  _markers = null,
  _buildingInfo;
var MapStore = assign({}, PrototypeStore, {
  setPureMenu: function() {
    _dateMenu = [];
    _selectDate = null;
    _selectedDateType = null;
    _dateType.forEach((type, index) => {
      let dateText = CommonFuns.GetDate(type);
      _dateMenu.push({
        id: relativeDateType[index],
        text: dateText.date,
        selectedText: dateText.energyDate,
        selected: false
      });
    });
  },
  setSelectedDate: function(dateId) {
    this.setPureMenu();
    _selectedDateType = dateId;
    _dateMenu.forEach(menu => {
      if (menu.id === dateId) {
        menu.selected = true;
        _selectDate = menu.selectedText;
      }
    });
  },
  setMapInfo: function(list) {
    _markers = [];
    for (var i = 0; i < list.length; i++) {
      var poi = list[i];
      _markers[poi.Id] = {
        id: poi.Id,
        name: poi.Name,
        lat: poi.Latitude,
        lon: poi.Longitude,
        dataValues: poi.DataValues,
        imageId: poi.PictureId,
      };
    }

  },
  setBuildingInfo: function(info) {
    _buildingInfo = {
      id: info.Id,
      name: info.Name,
      lat: info.Latitude,
      lon: info.Longitude,
      dataValues: info.DataValues,
      imageId: info.PictureId,
    };
  },
  getBuildingInfo: function() {
    return _buildingInfo;
  },
  getSelectedDateType: function() {
    return _selectedDateType;
  },
  getMarkers() {
    return _markers;
  },
  getDateMenu: function() {
    return _dateMenu;
  },
  getSelectedDate: function() {
    return _selectDate;
  },
  emitDateMenuChange: function() {
    this.emit(DATE_MENU_EVENT);
  },
  addDateMenuListener: function(callback) {
    this.on(DATE_MENU_EVENT, callback);
  },
  removeDateMenuListener: function(callback) {
    this.removeListener(DATE_MENU_EVENT, callback);
    this.dispose();
  },
  emitMapInfoChange: function() {
    this.emit(MAP_INFO_EVENT);
  },
  addMapInfoListener: function(callback) {
    this.on(MAP_INFO_EVENT, callback);
  },
  removeMapInfoListener: function(callback) {
    this.removeListener(MAP_INFO_EVENT, callback);
    this.dispose();
  },
  emitBuildingInfoChange: function() {
    this.emit(BUILDING_INFO_EVENT);
  },
  addBuildingInfoListener: function(callback) {
    this.on(BUILDING_INFO_EVENT, callback);
  },
  removeBuildingInfoListener: function(callback) {
    this.removeListener(BUILDING_INFO_EVENT, callback);
    this.dispose();
  },
});
var MapAction = Map.Action;

MapStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case MapAction.SET_SELECTED_DATE:
      MapStore.setSelectedDate(action.dateId);
      MapStore.emitDateMenuChange();
      break;
    case MapAction.SET_MAP_LIST:
      MapStore.setMapInfo(action.mapList);
      MapStore.emitMapInfoChange();
      break;
    case MapAction.SET_MAP_BUILDING:
      MapStore.setBuildingInfo(action.buildInfo);
      MapStore.emitBuildingInfoChange();
      break;
  }
});
module.exports = MapStore;
