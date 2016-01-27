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
    _carbons = (!carbons) ? emptyList() : Immutable.fromJS(carbons);
    _conversionPairs.forEach(carbon => {
      let index = -1;
      index = (!carbons) ? index : _carbons.findIndex(item => (item.getIn(['ConversionPair', 'SourceCommodity', 'Id']) == carbon.getIn(['SourceCommodity', 'Id'])
        && item.getIn(['ConversionPair', 'DestinationCommodity', 'Id']) == carbon.getIn(['DestinationCommodity', 'Id'])
        && item.getIn(['ConversionPair', 'SourceUom', 'Id']) == carbon.getIn(['SourceUom', 'Id'])
        && item.getIn(['ConversionPair', 'DestinationUom', 'Id']) == carbon.getIn(['DestinationUom', 'Id'])));
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
    if (id !== 0) {
      if (!!id) {
        var filterCarbon = Immutable.fromJS(_carbons).filter(item => item.get("Id") == id);
        _persistedCarbon = _updatingCarbon = filterCarbon.first();
      } else {
        _persistedCarbon = _updatingCarbon = emptyMap();
        var factors = Immutable.fromJS([{
          EffectiveYear: 0
        }]);
        _updatingCarbon = _updatingCarbon.set('Factors', factors);
      }
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
  checkError: function() {
    var factors = _updatingCarbon.get('Factors'),
      errors = emptyList();

    factors.forEach((item, id) => {
      if (item.get('EffectiveYear') !== 0) {
        let filterId = factors.findIndex(el => {
          return (el.get('EffectiveYear') == item.get('EffectiveYear'));
        });
        if (filterId != id) {
          errors = errors.setIn([filterId], I18N.Setting.CarbonFactor.Conflict);
          errors = errors.setIn([id], I18N.Setting.CarbonFactor.Conflict);
        }
      }

    });

    _updatingCarbon = _updatingCarbon.set('Errors', errors);
  },
  merge: function(data) {
    switch (data.path) {
      case 'ConversionPair':
        var index = data.value.value;
        if (index !== 0) {
          _updatingCarbon = _updatingCarbon.set(data.path, _selectableCarbons.getIn([index - 1]));
        }
        break;
      case 'EffectiveYear':
        var year = data.value.titleItems[data.value.value],
          factorIndex = data.value.factorIndex,
          that = this;
        var factors = _updatingCarbon.get('Factors');
        _updatingCarbon = _updatingCarbon.set('Factors', factors.update(factorIndex, (item) => {
          return factors.getIn([factorIndex]).set('EffectiveYear', year.text);
        }));
        that.checkError();
        break;
      case 'FactorValue':
        var value = data.value.value,
          factorIndex = data.value.factorIndex;
        var factors = _updatingCarbon.get('Factors');
        _updatingCarbon = _updatingCarbon.set('Factors', factors.update(factorIndex, (item) => {
          return factors.getIn([factorIndex]).set('FactorValue', value);
        }));
        break;
    }

  },
  addFactor: function() {
    var factors = _updatingCarbon.get('Factors');
    factors = factors.unshift(Immutable.fromJS({
      EffectiveYear: 0
    }));
    _updatingCarbon = _updatingCarbon.set('Factors', factors);
    this.checkError();
  },
  deleteFactor: function(index) {
    var factors = _updatingCarbon.get('Factors');
    _updatingCarbon = _updatingCarbon.set('Factors', factors.delete(index));
    this.checkError();
  },
  deleteCarbon(deletedId) {
    var deletedIndex = -1;

    if (_carbons.size < 2) {
      this.setCarbons(null);
      _persistedCarbon = emptyMap();
      _updatingCarbon = emptyMap();
      return 0;
    }

    var nextSelectedId = 0;

    _carbons.every((item, index) => {
      if (item.get("Id") == deletedId) {
        deletedIndex = index;
        if (index == _carbons.size - 1) {
          nextSelectedId = _carbons.getIn([index - 1, "Id"]);
        } else {
          nextSelectedId = _carbons.getIn([index + 1, "Id"]);
        }
        return false;
      }
      return true;
    });
    _carbons = _carbons.deleteIn([deletedIndex]);
    this.setCarbons(_carbons.toJS());
    return nextSelectedId;
  },
  reset: function() {
    _updatingCarbon = _persistedCarbon;
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
      if (!!action.carbons) {
        if (pre.size === 0) {
          CarbonStore.setSelectedId(_carbons.getIn([0, "Id"]));
          CarbonStore.emitChange(_carbons.getIn([0, "Id"]));
        } else {
          CarbonStore.setSelectedId(_selectedId);
          CarbonStore.emitChange(_selectedId);
        }
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
    case CarbonAction.ADD_FACTOR:
      CarbonStore.addFactor();
      CarbonStore.emitChange();
      break;
    case CarbonAction.DELETE_FACTOR:
      CarbonStore.deleteFactor(action.index);
      CarbonStore.emitChange();
      break;
    case CarbonAction.SAVE_FACTOR_SUCCESS:
      CarbonStore.setSelectedId(action.id);
      break;
    case CarbonAction.DELETE_FACTOR_SUCCESS:
      var selecteId = CarbonStore.deleteCarbon(action.id);
      CarbonStore.setSelectedId(selecteId);
      CarbonStore.emitChange(selecteId);
      break;

    case CarbonAction.RESET_CARBON:
      CarbonStore.reset();
      break;

  }
});
module.exports = CarbonStore;
