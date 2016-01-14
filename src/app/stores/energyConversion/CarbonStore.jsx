import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
import Carbon from '../../constants/actionType/energyConversion/Carbon.jsx';

function emptyList() {
  return new List();
}
function emptyMap() {
  return new Map();
}

let _conversionPairs = emptyList(),
  _carbons = emptyList(),
  _selectableCarbons = emptyList(),
  _persistedCarbon = emptyMap(),
  _updatingCarbon = emptyMap(),
  _selectedId = null;
let CHANGE_EVENT = 'change';

var CarbonStore = assign({}, PrototypeStore, {
  setConversionPairs: function(conversionPairs) {
    _conversionPairs = Immutable.fromJS(conversionPairs);
  },
  setCarbons: function(carbons) {
    _selectableCarbons = emptyList();
    _carbons = Immutable.fromJS(carbons);
    _conversionPairs.forEach(carbon => {
      let index = _carbons.findIndex(item => (item.getIn(['ConversionPair', 'SourceCommodity', 'Id']) == carbon.getIn(['SourceCommodity', 'Id'])
        && item.getIn(['ConversionPair', 'DestinationCommodity', 'Id']) == carbon.getIn(['DestinationCommodity', 'Id'])));
      if (index < 0) {
        _selectableCarbons = _selectableCarbons.push(carbon);
      }
    });
  },
  getCarbons: function() {
    return _carbons;
  },
  getSelectableCarbons: function() {
    return _selectableCarbons;
  },
  setSelectedId: function(id) {
    _selectedId = id;
    if (!!id) {
      var filterCarbon = Immutable.fromJS(_carbons).filter(item => item.get("Id") == id);
      _persistedCarbon = _updatingCarbon = filterCarbon.first();
    } else {
      _persistedCarbon = _updatingCarbon = emptyMap();
      var factors = Immutable.fromJS([{
        EffectiveYear: 0
      }]);
      _persistedCarbon = _persistedCarbon.set('Factors', factors);
      _updatingCarbon = _updatingCarbon.set('Factors', factors);
    }
  },
  getPersistedCarbon: function() {
    return _persistedCarbon;
  },
  getUpdatingCarbon: function() {
    return _updatingCarbon;
  },
  clearAll: function() {
    _conversionPairs = emptyList();
    _carbons = emptyList();
    _selectableCarbons = emptyList();
    _persistedCarbon = emptyMap();
    _updatingCarbon = emptyMap();
    _selectedId = null;
  },
  merge: function(data) {
    if (data.path == 'ConversionPair') {
      var index = data.value.value;
      if (index !== 0) {
        _updatingCarbon = _updatingCarbon.set(data.path, _selectableCarbons.getIn([index - 1]));
      }
    }
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
});
var CarbonAction = Carbon.Action;

CarbonStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case CarbonAction.GET_CONVERSION_PAIRS:
      CarbonStore.setConversionPairs(action.conversionPairs);
      break;
    case CarbonAction.GET_ALL_CARBON_FACTOR:
      var pre = _carbons;
      CarbonStore.setCarbons(action.carbons);
      if (pre.size === 0) {
        CarbonStore.setSelectedId(_carbons.getIn([0, "Id"]));
        CarbonStore.emitChange(_carbons.getIn([0, "Id"]));
      } else {
        CarbonStore.emitChange();
      }
      break;
    case CarbonAction.SET_SELECTED_ID:
      CarbonStore.setSelectedId(action.id);
      break;
    case CarbonAction.CLEAR_ALL:
      CarbonStore.clearAll();
      break;
    case CarbonAction.MERGE_CARBON:
      CarbonStore.merge(action.data);
      CarbonStore.emitChange();
      break;

  }
});
module.exports = CarbonStore;
